import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page container notfound">
      <h1>0x194</h1>
      <p>SEGFAULT — page dereferenced a null route.</p>
      <Link className="btn" to="/">
        return home
      </Link>
    </div>
  );
}
