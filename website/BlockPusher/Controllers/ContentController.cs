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
        /// <summary>
        /// Upload a file to the website's Content/Game/[ID] folder.
        /// </summary>
        /// <param name="fileName">User's file's name</param>
        /// <param name="path">Path to the file on the user's computer</param>
        /// <param name="gameId">Id of the game currently being edited</param>
        public void Upload(string fileName, string path, int gameId)
        {
            // testing only
            //string path = @"F:\School\Senior Design";
            //string fileName = "test.png";
            //int gameId = 2;


            // Get correct paths for source file and game folder
            string sourceFile = System.IO.Path.Combine(path, fileName);
            string destPath = Server.MapPath("~/Content/Game/" + gameId);

            // Create game folder if it doesn't exist (CreateDirectory checks this implicitly) and add file name to destination path
            System.IO.Directory.CreateDirectory(destPath);
            string destFile = destPath + "/" + fileName;

            System.IO.File.Copy(sourceFile, destFile, true);
        }


        /// <summary>
        /// Renames a file.
        /// </summary>
        /// <param name="oldName">Old name of the file</param>
        /// <param name="newName">New file name specified by user</param>
        /// <param name="gameId">Id of the game currently being edited</param>
        public void Rename(string oldName, string newName, int gameId)
        {
            // testing only
            //string oldName = "test.png";
            //string newName = "test2.png";
            //int gameId = 2;

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


        /// <summary>
        /// Deletes a file from that game's content folder.
        /// </summary>
        /// <param name="fileName">Name of the file to be deleted.</param>
        /// <param name="gameId">Id of the game currently being edited</param>
        public void Delete(string fileName, int gameId)
        {
            // testing only
            //string fileName = "test.png";
            //int gameId = 2;

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
        public List<string> GetFileNames(int gameId)
        {
            // testing only
            //int gameId = 2;

            string path = Server.MapPath("~/Content/Game/" + gameId + "/");

            // Grab all files from current game directory
            string[] fileArray = System.IO.Directory.GetFiles(path);
            List<string> fileNames = new List<string>();

            // Add each file's name to list.
            foreach(string file in fileArray)
            {
                 fileNames.Add(Path.GetFileName(file));
            }

            return fileNames;
        }

        
        /// <summary>
        /// Saves a new game. 
        /// </summary>
        /// <param name="title"></param>
        /// <param name="description"></param>
        /// <returns>Game ID</returns>
        public int SaveNewGame(string title, string description)
        {
            //int gameId = 12;
            //string title = "test title";
            //string description = "test desc";
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
                //cmd.Parameters.AddWithValue("@gameid", gameId);
                int newId = (int)cmd.ExecuteScalar();
                myConnection.Close();

                return newId;
            }
        }

        public bool RenameGame(int gameId, string title)
        {
            //int gameId = 12;
            //string title = "test changing title";
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

        public bool ChangeGameDescription(int gameId, string description)
        {
            //int gameId = 12;
            //string description = "test changing title";
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
    }
}