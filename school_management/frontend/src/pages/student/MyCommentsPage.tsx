
import { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Paper, Divider } from '@mui/material';
import { getMyComments, type CommentDto } from '../../services/commentService';

function MyCommentsPage() {
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await getMyComments();
        setComments(data);
      } catch (error) {
        console.error("Yorumlar yüklenirken hata oluştu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) {
    return <Typography>Yükleniyor...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Hakkımdaki Yorumlar</Typography>
      <Paper>
        <List>
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <Box key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={comment.commentText}
                    secondary={`- ${comment.teacherName} (${comment.className}) | ${new Date(comment.createdAt).toLocaleDateString('tr-TR')}`}
                  />
                </ListItem>
                {index < comments.length - 1 && <Divider component="li" />}
              </Box>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="Hakkınızda henüz bir yorum bulunmamaktadır." />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default MyCommentsPage;
