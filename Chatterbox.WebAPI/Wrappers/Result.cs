namespace Chatterbox.WebAPI.Wrappers
{
    public class Result<T>
    {
        public Result()
        {
        }
        public Result(T data, string message = null)
        {
            Succeeded = true;
            Message = message;
            Data = data;
        }

        public Result(string message, ICollection<KeyValuePair<string, string>> errors)
        {
            Succeeded = false;
            Message = message;
            Errors = errors;
        }
        public Result(string message)
        {
            Succeeded = false;
            Message = message;
        }
        public bool Succeeded { get; set; }
        public string Message { get; set; }
        public ICollection<KeyValuePair<string, string>> Errors { get; set; }
        public T Data { get; set; }

    }
}
