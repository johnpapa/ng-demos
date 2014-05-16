using System;
using System.Data.Entity;

namespace Model
{
    // DEMONSTRATION/DEVELOPMENT ONLY
    public class TodoDatabaseInitializer :
        DropCreateDatabaseAlways<TodosContext> // re-creates every time the server starts
        //DropCreateDatabaseIfModelChanges<TodosContext> 
    {
        protected override void Seed(TodosContext context)
        {
            SeedDatabase(context);
        }

        public static void SeedDatabase(TodosContext context)
        {
            var todos = new[] {
                // Description, IsDone, IsArchived
                CreateTodo("Food", true),
                CreateTodo("Water", true),
                CreateTodo("Shelter", true),
                CreateTodo("Bread", false),
                CreateTodo("Cheese", false),
                CreateTodo("Wine", false)
           };

            Array.ForEach(todos, t => context.TodoItem.Add(t));

            context.SaveChanges(); // Save 'em
        }

        private static TodoItem CreateTodo(string description, bool isComplete)
        {
            return new TodoItem
            {
                Id = Guid.NewGuid(),
                Text = description,
                Complete = isComplete
            };
        }

    }
}
