using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace BlockPusher.Controllers
{
    public class PlayController : Controller
    {
        // GET: /Play
        public ActionResult Index()
        {
			return View();
		}

        // GET: /Play/Edit
        public ActionResult Edit()
        {
            return View();
        }

        // GET: /Play/Sandbox
        public ActionResult Sandbox()
		{
			var result = new FilePathResult("~/Views/Play/Sandbox.html", "text/html");
			return result;
		}
	}
}