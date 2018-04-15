using BlockPusher.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BlockPusher.Controllers
{
    public class ContentController : Controller
    {
        [HttpPost]
        /// <summary>
        /// Upload a file to the website's Content/Game/[ID] folder.
        /// </summary>
        /// <param name="fileName">User's file's name</param>
        /// <param name="path">Path to the file on the user's computer</param>
        /// <param name="gameId">Id of the game currently being edited</param>
        public void Upload(string fileName, string path, int gameId)
        {
            if (CheckGameOwnership(gameId) == false)
            {
                return;
            }

            // Get correct paths for source file and game folder
            string sourceFile = System.IO.Path.Combine(path, fileName);
            string destPath = Server.MapPath("~/Content/Game/" + gameId);

            // Create game folder if it doesn't exist (CreateDirectory checks this implicitly) and add file name to destination path
            System.IO.Directory.CreateDirectory(destPath);
            string destFile = destPath + "/" + fileName;

            System.IO.File.Copy(sourceFile, destFile, true);
        }

        [HttpPost]
        /// <summary>
        /// Renames a file.
        /// </summary>
        /// <param name="oldName">Old name of the file</param>
        /// <param name="newName">New file name specified by user</param>
        /// <param name="gameId">Id of the game currently being edited</param>
        public void Rename(string oldName, string newName, int gameId)
        {
            if (CheckGameOwnership(gameId) == false)
            {
                return;
            }

            // If they try to rename to the same name, ignore.
            if (String.Equals(oldName, newName))
            {
                return;
            }

            // Get correct paths
            string oldPath = Server.MapPath("~/Content/Game/" + gameId + "/" + oldName);
            string newPath = Server.MapPath("~/Content/Game/" + gameId + "/" + newName);

            // If old name doesn't exist, ignore.
            if (!System.IO.File.Exists(oldPath))
            {
                return;
            }

            // If a file already exists with new name, it is overwritten (deleted first).
            if (System.IO.File.Exists(newPath))
            {
                System.IO.File.Delete(newPath);
            }

            // Rename - move from old path with old file name to new path with new file name
            System.IO.File.Move(oldPath, newPath);
        }

        [HttpPost]
        /// <summary>
        /// Deletes a file from that game's content folder.
        /// </summary>
        /// <param name="fileName">Name of the file to be deleted.</param>
        /// <param name="gameId">Id of the game currently being edited</param>
        public void Delete(string fileName, int gameId)
        {
            if (CheckGameOwnership(gameId) == false)
            {
                return;
            }

            string path = Server.MapPath("~/Content/Game/" + gameId + "/" + fileName);

            // If a file exists with that name, it is deleted.
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
        }

        /// <summary>
        /// Returns all file names for the current game.
        /// </summary>
        /// <param name="gameId">Id of the game currently being edited</param>
        /// <returns>List of string file names</returns>
        public JsonResult GetFileNames(int gameId)
        {
            // Grab all files from current game directory
            List<string> fileNames = new List<string>();
            try
            {
                string path = Server.MapPath("~/Content/Game/" + gameId + "/");

                string[] fileArray = System.IO.Directory.GetFiles(path);

                // Add each file's name to list.
                foreach (string file in fileArray)
                {
                    fileNames.Add(Path.GetFileName(file));
                }
            }
            catch (Exception) { }

            return Json(fileNames, JsonRequestBehavior.AllowGet);
        }

        /*[HttpPost]
        [Authorize]
        /// <summary>
        /// Saves a new game. Title and description optional.
        /// </summary>
        /// <param name="title"></param>
        /// <param name="description"></param>
        /// <returns>Game ID</returns>
        public int SaveNewGame(string title, string description)
        {
            if (String.IsNullOrEmpty(title))
            {
                title = "New Game";
            }
            if (String.IsNullOrEmpty(description))
            {
                description = "Description placeholder";
            }

            var con = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            using (SqlConnection myConnection = new SqlConnection(con))
            {
                myConnection.Open();

                // Insert new game.
                string oString = "insert into Games (Title, Author, GameDescription) output inserted.GameId values (@title, @author, @description)";
                SqlCommand cmd = new SqlCommand(oString, myConnection);

                cmd.Parameters.AddWithValue("@title", title);
                cmd.Parameters.AddWithValue("@author", User.Identity.Name);
                cmd.Parameters.AddWithValue("@description", description);
                int newId = (int)cmd.ExecuteScalar();
                myConnection.Close();

                return newId;
            }
        }*/

        [HttpPost]
        [Authorize]
        /// <summary>
        /// Saves a new game, copying another game's files.
        /// </summary>
        /// <param name="gameId"></param>
        /// <returns>Redirect to edit new game.</returns>
        public RedirectToRouteResult CopyGame(int gameId)
        {
            var con = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            using (SqlConnection myConnection = new SqlConnection(con))
            {
                myConnection.Open();

                // Insert new game.
                string oString = @"INSERT INTO Games (Title, Author, GameDescription)
                    OUTPUT INSERTED.GameId
                    SELECT 'Copy of '+Title, @author, GameDescription FROM Games WHERE GameId = @sourceId";
                SqlCommand cmd = new SqlCommand(oString, myConnection);

                // Should probably be doing more error handling here but W/E.
                cmd.Parameters.AddWithValue("@author", User.Identity.Name);
                cmd.Parameters.AddWithValue("@sourceId", gameId);
                int newId = (int)cmd.ExecuteScalar();
                myConnection.Close();

                string newPath = Server.MapPath("~/Content/Game/" + newId + "/");

                // Make new directory.
                Directory.CreateDirectory(newPath);

                // Copy each old file.
                DirectoryInfo oldDir = new DirectoryInfo(Server.MapPath("~/Content/Game/" + gameId + "/"));

                foreach (FileInfo file in oldDir.EnumerateFiles())
                {
                    file.CopyTo(newPath + file.Name);
                }

                return RedirectToAction("Edit","Play",new { gameId = newId });
            }
        }

        [HttpPost]
        /// <summary>
        /// Renames game title in db.
        /// </summary>
        /// <param name="gameId"></param>
        /// <param name="title"></param>
        /// <returns>Bool indicating whether entry was changed.</returns>
        public bool RenameGame(int gameId, string title)
        {
            if (CheckGameOwnership(gameId) == false)
            {
                return false;
            }

            var con = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            using (SqlConnection myConnection = new SqlConnection(con))
            {
                string editString = "update Games set Title=@title where GameId=@gameid";
                myConnection.Open();

                // Change game's title.
                SqlCommand cmd = new SqlCommand(editString, myConnection);
                cmd.Parameters.AddWithValue("@title", title);
                cmd.Parameters.AddWithValue("@gameid", gameId);
                int changes = cmd.ExecuteNonQuery();
                myConnection.Close();

                return changes > 0;
            }
        }

        [HttpPost]
        /// <summary>
        /// Changes game description in db.
        /// </summary>
        /// <param name="gameId"></param>
        /// <param name="description"></param>
        /// <returns>Bool indicating whether entry was changed.</returns>
        public bool ChangeGameDescription(int gameId, string description)
        {
            if (CheckGameOwnership(gameId) == false)
            {
                return false;
            }

            var con = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            using (SqlConnection myConnection = new SqlConnection(con))
            {
                string editString = "update Games set GameDescription=@description where GameId=@gameid";
                myConnection.Open();

                // Change game's description.
                SqlCommand cmd = new SqlCommand(editString, myConnection);
                cmd.Parameters.AddWithValue("@description", description);
                cmd.Parameters.AddWithValue("@gameid", gameId);
                int changes = cmd.ExecuteNonQuery();
                myConnection.Close();

                return changes > 0;
            }
        }


        /// <summary>
        /// Check if the game ID is owned by the current user.
        /// </summary>
        /// <param name="gameId"></param>
        /// <returns>Bool indicating ownership.</returns>
        private bool CheckGameOwnership(int gameId)
        {
            var con = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            using (SqlConnection myConnection = new SqlConnection(con))
            {
                {
                    // Check to make sure game ID is associated with logged in user.
                    string getString = "select count(GameId) from Games where GameId=@gameid and Author=@author";
                    SqlCommand getCmd = new SqlCommand(getString, myConnection);
                    getCmd.Parameters.AddWithValue("@gameid", gameId);
                    getCmd.Parameters.AddWithValue("@author", User.Identity.Name);

                    myConnection.Open();

                    // If game ID is found, the user is the game's author.	
                    if ((int)getCmd.ExecuteScalar() > 0)
                    {
                        return true;
                    }
                    return false;
                }
            }
        }
    }
}