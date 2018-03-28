(function () {

    let sandboxElement = document.getElementById("play-sandbox");

    // Map of filename -> blob
    var files = {};
    var filesChanged = {};

    let filesListElement = document.getElementById("edit-files");

    // Currently selected file
    let currentFile = null;

    // Monaco Editor
    let editElement = document.getElementById("edit-code");
    let editor;

    // Preview elements
    let previewImage = document.getElementById("edit-pv-img");

    function isTextFile(fileName) {
        return fileName.endsWith(".js");
    }

    function isImageFile(fileName) {
        return fileName.endsWith(".png")
            || fileName.endsWith(".gif")
            || fileName.endsWith(".jpg")
            || fileName.endsWith(".jpeg");
    }

    // Call when a file is selected in the list.
    function selectFile(fileName) {
        if (fileName == currentFile)
            return;

        let blob = files[fileName];
        if (fileName !== null && blob == null)
            return;

        // Save the current file.
        if (fileName !== null) {
            runCode();
        }

        // Update the UI
        if (currentFile != null) {
            let oldElement = document.querySelector("#edit-files>li[data-filename='" + currentFile + "']");
            oldElement.classList.remove("active");
        }

        if (fileName !== null) {
            let newElement = document.querySelector("#edit-files>li[data-filename='" + fileName + "']");
            newElement.classList.add("active");
        }

        // Update the editor
        if (fileName === null) {

            // Display nothing.
            editElement.style.display = "none";
            previewImage.src = "";
            currentFile = fileName;
        } else if (isTextFile(fileName)) {
            var reader = new FileReader();
            reader.onload = function (e) {
                let code = e.target.result;
                editor.setValue(code);

                editElement.style.display = "";
                previewImage.src = "";
                currentFile = fileName;
            }
            reader.readAsText(blob);
        } else if (isImageFile(fileName)) {
            var reader = new FileReader();
            reader.onload = function (e) {
                let url = e.target.result;

                editElement.style.display = "none";
                previewImage.src = url;
                currentFile = fileName;
            }
            reader.readAsDataURL(blob);
        }
    }

    // Call when you add or change a file using the *editor*.
    // Just pass in null if a file is deleted.
    function updateFile(fileName, fileBlob) {
        addFile(fileName, fileBlob);

        filesChanged[fileName] = true;
    }

    // Call directly only when setting up files on editor start.
    function addFile(fileName, fileBlob) {
        if (fileName.match(/^[\w\d]+\.[\w\d]+$/) === null) {
            throw new Error("Bad filename.");
        }

        // Save file data
        files[fileName] = fileBlob;

        if (fileBlob !== null) {
            // Generate data URL
            var reader = new FileReader();
            reader.onload = function (e) {
                // Send file to the engine.
                let url = e.target.result;
                sandboxElement.contentWindow.postMessage({ type: "setFile", file: fileName, url: url }, "*");
            }
            reader.readAsDataURL(fileBlob);
        } else {
            // Let the engine know the file was deleted.
            sandboxElement.contentWindow.postMessage({ type: "setFile", file: fileName, url: null }, "*");
        }

        let listEntry = document.querySelector("#edit-files>li[data-filename='" + fileName + "']");
        if (fileBlob !== null) {
            // Add to the list.
            if (listEntry === null) {
                listEntry = document.createElement("li");
                listEntry.innerText = fileName;
                listEntry.setAttribute("data-filename", fileName);

                // Click Handler
                listEntry.addEventListener("click", function () { selectFile(fileName); });

                // Icon
                let iconHTML;
                if (isTextFile(fileName)) {
                    iconHTML = "<span class='glyphicon glyphicon-align-justify'></span>";
                } else if (isImageFile(fileName)) {
                    // Make the image element here. It is filled in later.
                    iconHTML = "<img class='edit-img-icon' />";
                } else {
                    iconHTML = "<span class='glyphicon glyphicon-cutlery'></span>";
                }
                listEntry.innerHTML = iconHTML + " " + listEntry.innerHTML;

                // Delete button (Don't add to some critical files.)
                if (fileName != "World.js") {
                    let delButton = document.createElement("button");
                    delButton.innerHTML = "&#10005;"; // Multiplication X
                    delButton.classList.add("btn", "btn-danger");
                    delButton.addEventListener("click", function (e) {
                        // TODO don't use stock confirm cruft.
                        if (confirm("Delete " + fileName + "?")) {
                            // Unselect!
                            if (currentFile == fileName) {
                                selectFile(null);
                            }
                            updateFile(fileName, null);
                        }
                        e.stopPropagation();
                    });
                    listEntry.appendChild(delButton);
                }

                // Add to our list (sort alphabetically)
                let children = filesListElement.children;
                let placed = false;
                for (let i = 0; i < children.length; i++) {
                    let childName = children[i].getAttribute("data-filename");
                    // Sort condition:
                    if (fileName.toLowerCase().charCodeAt(0) < childName.toLowerCase().charCodeAt(0)) {
                        filesListElement.insertBefore(listEntry, children[i]);
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    filesListElement.appendChild(listEntry);
                }
            }
            // Add/Update image icon. Ideally we would scale the image down properly but I am far too lazy for that.
            if (isImageFile(fileName)) {
                let img = listEntry.querySelector("img.edit-img-icon");

                var reader = new FileReader();
                reader.onload = function (e) {
                    let url = e.target.result;

                    img.src = url;
                }
                reader.readAsDataURL(fileBlob);
            }

        } else if (listEntry !== null) {
            // Remove from list.
            listEntry.remove();
        }
    }

    function fetchFile(fileName, fileURL) {
        fetch(fileURL).then(function (res) {
            if (res.status !== 200)
                throw new Error("Failed to fetch asset @ "+fileURL);
            return res.blob();
        }).then(function (blob) {
            addFile(fileName, blob);
        });
    }

    window.newFile = function () {
        let fileName = prompt("New Script Name:");
        if (fileName === null)
            return;

        fileName += ".js";

        if (files[fileName] != null) {
            alert("Script already exists!");
            return;
        }

        let blob = new Blob([], { type: "application/javascript" });

        try {
            updateFile(fileName, blob);
        } catch (e) {
            alert("Error creating script: "+e.message);
        }
    }

    // Monaco editor setup
    require.config({ paths: { "vs": "/Scripts/vs" } });
    require(['vs/editor/editor.main'], function () {
        editor = monaco.editor.create(editElement, {
            language: "javascript",
            automaticLayout: true,
            theme: "vs-dark"
        });

        // Add keyboard shortcuts to run code!
        editor.addAction({
            id: "blockpusher-run",
            label: "Run Code",
            keybindings: [
                monaco.KeyCode.F5,
                monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S
            ],
            run: function (editor) {
                runCode();
            }
        });
    });

    window.runCode = function() {
        if (currentFile !== null && isTextFile(currentFile)) {
            let fileBlob = new Blob([editor.getValue()], { type: "application/javascript" });
            updateFile(currentFile, fileBlob);
        }
    }

    // Not a fan of this at all but we need to wait until the engine loads.
    // TODO: have the engine notify us when it is ready for files.
    setTimeout(function () {
        fetchFile("World.js", "/Content/AssetTest/World.js");

        fetchFile("test.png", "/Content/AssetTest/test.png");
        fetchFile("test2.jpg", "/Content/AssetTest/test2.jpg");

        fetchFile("xxxx.jpg", "/Content/AssetTest/xxxx.jpg");

    }, 1000);
})();