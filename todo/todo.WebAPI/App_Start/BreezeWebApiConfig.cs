using System.Web.Http;
using System.Web.Http.Cors;
using Todo;

[assembly: WebActivator.PreApplicationStartMethod(
    typeof(BreezeWebApiConfig), "RegisterBreezePreStart")]
namespace Todo {
  ///<summary>
  /// Inserts the Breeze Web API controller route at the front of all Web API routes
  ///</summary>
  ///<remarks>
  /// This class is discovered and run during startup; see
  /// http://blogs.msdn.com/b/davidebb/archive/2010/10/11/light-up-your-nupacks-with-startup-code-and-webactivator.aspx
  ///</remarks>
  public static class BreezeWebApiConfig {

    public static void RegisterBreezePreStart() {

      // Allow CORS for all origins across all controllers. (Caution!)
      var cors = new EnableCorsAttribute("*", "*", "*");
      GlobalConfiguration.Configuration.EnableCors(cors);

      GlobalConfiguration.Configuration.Routes.MapHttpRoute(
          name: "BreezeApi",
          routeTemplate: "breeze/{controller}/{action}"
      );
    }
  }
}