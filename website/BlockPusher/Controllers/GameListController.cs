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
    public class GameListController : Controller
    {
        public ActionResult Index()
        {
            GameListModel model = new GameListModel();
            model.Games = new List<GameModel>();

            var con = ConfigurationManager.ConnectionStrings["DefaultConnection"].ToString();
            using (SqlConnection myConnection = new SqlConnection(con))
            {
                string editString = "select * from games";
                myConnection.Open();

                DataSet ds = new DataSet();          
                SqlCommand cmd = new SqlCommand(editString, myConnection);
                SqlDataAdapter adapter = new SqlDataAdapter();
                adapter.SelectCommand = cmd;
                adapter.Fill(ds);
                myConnection.Close();

                for (int i = 0; i <= ds.Tables[0].Rows.Count - 1; i++)
                {
                    var row = ds.Tables[0].Rows[i].ItemArray;
                    GameModel game = new GameModel
                    {
                        GameId = (int)row[0],
                        Title = row[1].ToString(),
                        Author = row[2].ToString(),
                        Description = row[3].ToString()
                    };
                    model.Games.Add(game);
                }

                return View(model);
            }
        }
    }
}