using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace BlockPusher
{
    public class MvcApplication : HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        private void Application_BeginRequest()
        {
            // Allow CORS for game assets.
            // We need this because of the sandboxing on the engine.
            // This is really gross but all the other ways to do it were even more gross.

            if (Request != null && Request.Path != null && Request.Path.StartsWith("/Content/Game/"))
            {
                if (Response != null && Response.Headers != null)
                {
                    Response.Headers.Add("Access-Control-Allow-Origin", "*");
                }
            }
        }
    }
}
