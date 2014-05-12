using System.ComponentModel.DataAnnotations;

namespace Todo.Models
{
    public class TodoItem
    {
        public int Id { get; set; }                     // 42

        [Required, StringLength(maximumLength: 30)]     // Validation rules
        public string Description { get; set; }         // "Get milk"

        public System.DateTime CreatedAt { get; set; }  // 25 August 2012, 9am PST
        public bool IsDone { get; set; }                // false
        public bool IsArchived { get; set; }            // false
    }
}