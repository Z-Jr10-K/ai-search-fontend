import bot from "../icons/bot.png";
import user from "../icons/user.png";
import Answer from "./answer";
import "./message.css";

export default function Message({ role, content, sources }) {
  return (
    <div className="wrapper">
      <div className= "avatar">
        <img
          src={role === "assistant" ? bot : user}
          alt="profile avatar"
          width="35"
          height="35"
        />
      </div>
      <div className="content">
        {role === 'assistant' ?(
          <Answer markdown={content} sources={sources}/>
        ):(
        <p>{content}</p>
        )}
      </div>
    </div>
  );
}