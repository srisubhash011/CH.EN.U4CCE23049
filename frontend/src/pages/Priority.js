import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, Card, CardContent, Chip, Box, CircularProgress, TextField, Avatar, Fade
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import TimelineIcon from '@mui/icons-material/Timeline';

const Priority = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [limit, setLimit] = useState(10);
  
  const [viewed, setViewed] = useState(() => {
    return JSON.parse(localStorage.getItem('viewedNotifications') || '[]');
  });

  const fetchPriorityNotifications = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://20.207.122.201/evaluation-service/notifications');
      let notifs = res.data.notifications || [];
      
      notifs = notifs.map(n => {
        let weight = 0;
        if (n.Type === 'Placement') weight = 30000000000;
        if (n.Type === 'Result') weight = 20000000000;
        if (n.Type === 'Event') weight = 10000000000;
        
        const timestamp = new Date(n.Timestamp.replace(' ', 'T')).getTime() / 1000;
        const score = weight + timestamp;
        return { ...n, score };
      });
      
      notifs.sort((a, b) => b.score - a.score);
      setNotifications(notifs.slice(0, limit));
      
    } catch (err) {
      console.error("API failed, using fallback data. Error:", err);
      let notifs = [
        { "ID": "d146095a", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:51:30" },
        { "ID": "b283218f", "Type": "Placement", "Message": "CSX Corporation hiring", "Timestamp": "2026-04-22 17:51:18" },
        { "ID": "81589ada", "Type": "Event", "Message": "farewell", "Timestamp": "2026-04-22 17:51:06" },
        { "ID": "0005513a", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:54" },
        { "ID": "ea836726", "Type": "Event", "Message": "tech-fest", "Timestamp": "2026-04-22 17:50:42" },
        { "ID": "8a7412bd", "Type": "Placement", "Message": "Advanced Micro Devices Inc. hiring", "Timestamp": "2026-04-22 17:49:42" }
      ];

      notifs = notifs.map(n => {
        let weight = 0;
        if (n.Type === 'Placement') weight = 30000000000;
        if (n.Type === 'Result') weight = 20000000000;
        if (n.Type === 'Event') weight = 10000000000;
        
        const timestamp = new Date(n.Timestamp.replace(' ', 'T')).getTime() / 1000;
        const score = weight + timestamp;
        return { ...n, score };
      });
      
      notifs.sort((a, b) => b.score - a.score);
      setNotifications(notifs.slice(0, limit));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPriorityNotifications();
  }, [limit]);

  const markViewed = (id) => {
    if (!viewed.includes(id)) {
      const newViewed = [...viewed, id];
      setViewed(newViewed);
      localStorage.setItem('viewedNotifications', JSON.stringify(newViewed));
    }
  };

  const getTypeStyles = (notifType) => {
    switch (notifType) {
      case 'Placement': return { icon: <WorkIcon />, bg: '#dcfce7', text: '#166534' };
      case 'Result': return { icon: <TimelineIcon />, bg: '#fef3c7', text: '#92400e' };
      case 'Event': return { icon: <EventIcon />, bg: '#e0e7ff', text: '#3730a3' };
      default: return { icon: <EventIcon />, bg: '#f1f5f9', text: '#475569' };
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={4}>
        <Box>
          <Typography variant="h4" sx={{ 
            background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            display: 'inline-block'
          }}>
            Priority Inbox
          </Typography>
          <Typography variant="subtitle1" sx={{ mt: 1 }}>Algorithmically sorted by weight & recency</Typography>
        </Box>
        <TextField 
          label="Limit Top N" 
          type="number" 
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value) || 1)}
          inputProps={{ min: 1, max: 50 }}
          sx={{ width: 120, backgroundColor: '#fff', borderRadius: 2 }}
        />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress size={60} thickness={4} color="secondary" />
        </Box>
      ) : (
        <Box>
          {notifications.map((n, index) => {
            const isViewed = viewed.includes(n.ID);
            const typeStyle = getTypeStyles(n.Type);
            
            return (
              <Fade in={true} timeout={300 + (index * 100)} key={n.ID}>
                <Card 
                  sx={{ 
                    mb: 2.5, 
                    backgroundColor: isViewed ? '#ffffff' : '#fff5f7',
                    borderLeft: isViewed ? '4px solid transparent' : '4px solid #ec4899',
                    cursor: 'pointer',
                    opacity: isViewed ? 0.8 : 1
                  }}
                  onClick={() => markViewed(n.ID)}
                  onMouseEnter={() => markViewed(n.ID)}
                >
                  <CardContent sx={{ pb: '16px !important', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar sx={{ bgcolor: typeStyle.bg, color: typeStyle.text, width: 56, height: 56 }}>
                      {typeStyle.icon}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Typography variant="h6" sx={{ color: isViewed ? '#64748b' : '#0f172a' }}>
                          {n.Message}
                        </Typography>
                        {!isViewed && (
                          <Chip label="URGENT" size="small" sx={{ bgcolor: '#ec4899', color: '#fff', fontWeight: 'bold', fontSize: '0.7rem', height: 20 }} />
                        )}
                      </Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Chip label={n.Type} size="small" sx={{ bgcolor: typeStyle.bg, color: typeStyle.text, fontWeight: 600 }} />
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                          {new Date(n.Timestamp.replace(' ', 'T')).toLocaleString()}
                        </Typography>
                        <Chip label={`Score: ${n.score}`} size="small" variant="outlined" sx={{ ml: 'auto', color: '#94a3b8', borderColor: '#e2e8f0' }} />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default Priority;
