import React from 'react';
import { Box, Typography, LinearProgress, List, ListItem, ListItemText } from '@mui/material';

const ProductivityDashboard = ({ data }) => {
    return (
        <Box>
            <Typography variant="h6">Поточний рівень продуктивності</Typography>
            <Typography variant="h4" sx={{ mb: 1 }}>
                {(data.average_productivity)}%
            </Typography>
            <LinearProgress
                variant="determinate"
                value={data.average_productivity}
                sx={{ height: 10, borderRadius: 5, mb: 2 }}
            />
            <Typography variant="h6" sx={{ mt: 2 }}>Рекомендації</Typography>
            <List>
                {data.overall_recommendations.map((recommendation, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={recommendation} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ProductivityDashboard;