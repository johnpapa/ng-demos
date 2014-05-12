using System;
using System.Linq;
using System.Web.Http;
using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Breeze.WebApi2;

using Todo.Models;
using Newtonsoft.Json.Linq;

namespace Todo.Controllers
{
    [BreezeController]
    public class TodosController : ApiController {

        static readonly TimeSpan RefreshRate = TimeSpan.FromMinutes(60);
        private static readonly object Locker = new object();
        static DateTime _lastRefresh = DateTime.Now; // will first clear db at Now + "RefreshRate" 
        // static DateTime lastRefresh = DateTime.MinValue; // will clear when server starts

        readonly EFContextProvider<TodosContext> _contextProvider =
            new EFContextProvider<TodosContext>();

        public TodosController()
        {
            PeriodicReset();
        }

        // ~/breeze/todos/Metadata 
        [HttpGet]
        public string Metadata() {
            return _contextProvider.Metadata();
        }

        // ~/breeze/todos/Todos
        // ~/breeze/todos/Todos?$filter=IsArchived eq false&$orderby=CreatedAt 
        [HttpGet]
        public IQueryable<TodoItem> Todos() {
            return _contextProvider.Context.Todos;
        }

        // ~/breeze/todos/SaveChanges
        [HttpPost]
        public SaveResult SaveChanges(JObject saveBundle) {
            return _contextProvider.SaveChanges(saveBundle);
        }

        // ~/breeze/todos/purge
        [HttpPost]
        public string Purge()
        {
            TodoDatabaseInitializer.PurgeDatabase(_contextProvider.Context);
            return "purged";
        }

        // ~/breeze/todos/reset
        [HttpPost]
        public string Reset()
        {
            Purge();
            TodoDatabaseInitializer.SeedDatabase(_contextProvider.Context);
            return "reset";
        }

        /// <summary>
        /// Reset the database to it's initial data state after the server has run 
        /// for "RefreshRate" minutes.
        /// </summary>
        private void PeriodicReset()
        {
            if ((DateTime.Now - _lastRefresh) > RefreshRate)
            {
                lock (Locker)
                {
                    if ((DateTime.Now - _lastRefresh) > RefreshRate)
                    {
                        _lastRefresh = DateTime.Now;
                        Reset();
                    }
                }
            }
        }
    }
}