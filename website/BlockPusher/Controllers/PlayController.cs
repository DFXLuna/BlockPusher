using BlockPusher.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BlockPusher.Controllers
{
    public class PlayController : Controller
    {
        // GET: /Play
        public ActionResult Index(int gameId)
        {
            var con = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            using (SqlConnection myConnection = new SqlConnection(con))
            {
                string editString = "SELECT Games.GameId,Games.Title,AspNetUsers.Name,Games.GameDescription,Games.Author FROM Games, AspNetUsers WHERE Games.Author = AspNetUsers.UserName AND Games.GameId = @gameId";
                myConnection.Open();

                DataSet ds = new DataSet();
                SqlCommand cmd = new SqlCommand(editString, myConnection);
                cmd.Parameters.AddWithValue("@gameId", gameId);
                SqlDataAdapter adapter = new SqlDataAdapter();
                adapter.SelectCommand = cmd;
                adapter.Fill(ds);
                myConnection.Close();

                if (ds.Tables[0].Rows.Count != 1)
                {
                    return View("Error");
                }
                var row = ds.Tables[0].Rows[0].ItemArray;
                GameModel game = new GameModel
                {
                    GameId = (int)row[0],
                    Title = row[1].ToString(),
                    Author = row[2].ToString(),
                    Description = row[3].ToString(),
                    CanEdit = (row[4].ToString() == User.Identity.Name)
                };

                return View(game);
            }
		}

        // GET: /Play/Edit
        [Authorize]
        public ActionResult Edit(int gameId)
        {
            var con = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            using (SqlConnection myConnection = new SqlConnection(con))
            {
                string editString = "SELECT Games.GameId,Games.Title,AspNetUsers.Name,Games.GameDescription,Games.Author FROM Games, AspNetUsers WHERE Games.Author = AspNetUsers.UserName AND Games.GameId = @gameId";
                myConnection.Open();

                DataSet ds = new DataSet();
                SqlCommand cmd = new SqlCommand(editString, myConnection);
                cmd.Parameters.AddWithValue("@gameId", gameId);
                SqlDataAdapter adapter = new SqlDataAdapter();
                adapter.SelectCommand = cmd;
                adapter.Fill(ds);
                myConnection.Close();

                if (ds.Tables[0].Rows.Count != 1)
                {
                    return View("Error");
                }
                var row = ds.Tables[0].Rows[0].ItemArray;
                GameModel game = new GameModel
                {
                    GameId = (int)row[0],
                    Title = row[1].ToString(),
                    Author = row[2].ToString(),
                    Description = row[3].ToString(),
                    CanEdit = (row[4].ToString() == User.Identity.Name)
                };

                if (!game.CanEdit)
                {
                    return View("Error");
                }

                return View(game);
            }
        }

        // GET: /Play/Sandbox
        public ActionResult Sandbox(int? gameId)
		{
            string host = Request.Url.Scheme + "://" + Request.Headers.Get("Host");

            // Set us a CSP. Restrict to our content directory, or fall back on data URLs.
            Response.Headers.Add("Content-Security-Policy",
                "default-src " + ((gameId != null) ? host + "/Content/Game/"+ gameId + "/" : "data:") + ";" +
                "style-src 'unsafe-inline';" +
                "script-src " + host + "/Scripts/ 'unsafe-eval';");

            return new FilePathResult("~/Views/Play/Sandbox.html", "text/html");
		}
	}
}