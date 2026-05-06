import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Typography, Card, CardContent, Chip, Box, Select, MenuItem, 
  FormControl, InputLabel, Pagination, CircularProgress, Avatar, Fade
} from '@mui/material';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import TimelineIcon from '@mui/icons-material/Timeline';

const Home = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  
  const [viewed, setViewed] = useState(() => {
    return JSON.parse(localStorage.getItem('viewedNotifications') || '[]');
  });

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let url = `http://20.207.122.201/evaluation-service/notifications?limit=10&page=${page}`;
      if (type) {
        url += `&notification_type=${type}`;
      }
      const res = await axios.get(url);
      
      const notifs = res.data.notifications || [];
      setNotifications(notifs);
    } catch (err) {
      console.error("API failed, using fallback data. Error:", err);
      let mockData = [
        { "ID": "d146095a", "Type": "Result", "Message": "mid-sem", "Timestamp": "2026-04-22 17:51:30" },
        { "ID": "b283218f", "Type": "Placement", "Message": "CSX Corporation hiring", "Timestamp": "2026-04-22 17:51:18" },
        { "ID": "81589ada", "Type": "Event", "Message": "farewell", "Timestamp": "2026-04-22 17:51:06" },
        { "ID": "0005513a", "Type": "Result", "Message": "project-review", "Timestamp": "2026-04-22 17:50:54" },
        { "ID": "ea836726", "Type": "Event", "Message": "tech-fest", "Timestamp": "2026-04-22 17:50:42" },
        { "ID": "8a7412bd", "Type": "Placement", "Message": "Advanced Micro Devices Inc. hiring", "Timestamp": "2026-04-22 17:49:42" }
      ];
      
      if (type) {
        mockData = mockData.filter(n => n.Type === type);
      }
      setNotifications(mockData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, type]);

  const markViewed = (id) => {
    if (!viewed.includes(id)) {
      const newViewed = [...viewed, id];
      setViewed(newViewed);
      localStorage.setItem('viewedNotifications', JSON.stringify(newViewed));
    }
  };

  const getTypeStyles = (notifType) => {
    switch (notifType) {
      case 'Placement': return { color: 'success', icon: <WorkIcon />, bg: '#dcfce7', text: '#166534' };
      case 'Result': return { color: 'warning', icon: <TimelineIcon />, bg: '#fef3c7', text: '#92400e' };
      case 'Event': return { color: 'info', icon: <EventIcon />, bg: '#e0e7ff', text: '#3730a3' };
      default: return { color: 'default', icon: <NotificationsActiveIcon />, bg: '#f1f5f9', text: '#475569' };
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4">Dashboard</Typography>
          <Typography variant="subtitle1">Stay updated with your latest alerts</Typography>
        </Box>
        <FormControl sx={{ minWidth: 200, backgroundColor: '#fff', borderRadius: 2 }}>
          <InputLabel>Filter by Type</InputLabel>
          <Select
            value={type}
            label="Filter by Type"
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value=""><em>All Notifications</em></MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={10}>
          <CircularProgress size={60} thickness={4} />
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
                    backgroundColor: isViewed ? '#ffffff' : '#f8fafc',
                    borderLeft: isViewed ? '4px solid transparent' : '4px solid #4f46e5',
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
                          <Chip label="NEW" size="small" sx={{ bgcolor: '#ef4444', color: '#fff', fontWeight: 'bold', fontSize: '0.7rem', height: 20 }} />
                        )}
                      </Box>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Chip label={n.Type} size="small" sx={{ bgcolor: typeStyle.bg, color: typeStyle.text, fontWeight: 600 }} />
                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                          {new Date(n.Timestamp.replace(' ', 'T')).toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            );
          })}
          
          <Box display="flex" justifyContent="center" mt={5} mb={5}>
            <Pagination 
              count={5} 
              page={page} 
              onChange={(e, value) => setPage(value)} 
              color="primary" 
              size="large"
              shape="rounded"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Home;
