using System.Linq;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Breeze.WebApi2;
using Model;
using Newtonsoft.Json.Linq;

namespace Todo
{
    [BreezeController]
    public class TodosController : ApiController
    {
         // DEMO ONLY
        private readonly EFContextProvider<TodosContext> _contextProvider = 
            new EFContextProvider<TodosContext>();

        // ~/breeze/todos/Metadata 
        [HttpGet]
        public string Metadata()
        {
            return _contextProvider.Metadata();
        }

        // ~/breeze/todos/Todos
        // ~/breeze/todos/Todos?$filter=Completed eq false&$orderby=Text 
        [HttpGet]
        public IQueryable<TodoItem> TodoItem()
        {
            return _contextProvider.Context.TodoItem;
        }

        // ~/breeze/todos/SaveChanges
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle)
        {
            return _contextProvider.SaveChanges(saveBundle);
        }
    }
}
