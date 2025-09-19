import { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Pagination, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";  
import { blogService } from "@src/services/blogService.js";
import routes from "@src/router/index.js";
import { message } from "@utils/message.js";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const response = await blogService.getAllBlog(page);
        const publishedBlogs = response.content.filter((blog) => blog.blogStatus === "PUBLISHED");
        setBlogs(publishedBlogs || []);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error(message.ERROR_FETCH_DATA, error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [page]);

  const handleBlogClick = (id) => {
    navigate(routes.blogDetail.replace(":id", id));
  };

  return (
    <div className="container mx-auto px-[10rem] py-4">
      {loading ? (
        <div className="flex h-screen items-center justify-center text-2xl">
          <CircularProgress size="6rem" />
        </div>
      ) : (
        <>
          <Grid container spacing={4}>
            {blogs.map((blog) => (
              <Grid item xs={12} key={blog.id}>
                <Card onClick={() => handleBlogClick(blog.blogId)} className="cursor-pointer">
                  <Grid container>
                    {/* Image section */}
                    <Grid item xs={5} className="h-64 bg-gray-300">
                      <img 
                        src={blog.imageUrl} 
                        alt={blog.title} 
                        className="object-cover w-full h-full"
                      />
                    </Grid>

                    {/* Title section */}
                    <Grid item xs={7}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {blog.title}
                        </Typography>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(event, value) => setPage(value)}
              color="primary"
            />
          </div>
        </>
      )}
    </div>
  );
}
