import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { blogService } from "@src/services/blogService.js";
import { CircularProgress } from "@mui/material";
import { message } from "@utils/message.js";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        const response = await blogService.getDetailBlog(id);
        setBlog(response.data);
      } catch (error) {
        console.error(message.ERROR_FETCH_DATA, error);
      }
    };

    fetchBlogDetail();
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      {blog ? (
        <div className="text-left flex items-center justify-center">
          {/* <h1 className="text-2xl font-bold">{blog.title}</h1> */}
          <div
            className="prose "
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center text-2xl">
          <CircularProgress size="6rem" />
        </div>
      )}
    </div>
  );
}
