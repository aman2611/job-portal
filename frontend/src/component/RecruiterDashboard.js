import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Avatar,
    InputBase,
    Grid,
    Chip,
} from "@mui/material";
import { PieChart } from '@mui/x-charts/PieChart';
import apiList from "../lib/apiList";
import { useTheme } from "@emotion/react";

const RecruiterDashboard = () => {
    const [overviewData, setOverviewData] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [totalApplications, setTotalApplications] = useState(0);
    const [openPositions, setOpenPositions] = useState(0);
    const [interviewsScheduled, setInterviewsScheduled] = useState(0);
    const [timeToHire, setTimeToHire] = useState(0);
    const [statusDistribution, setStatusDistribution] = useState([]);

    // Pastel color palette
    const pastelColors = [
        '#FFD1DC', // Pastel Pink
        '#FFEBCD', // Pastel Peach
        '#E6E6FA', // Pastel Lavender
        '#98FB98', // Pastel Green
        '#87CEFA', // Pastel Blue
        '#DDA0DD'  // Pastel Plum
    ];

    const fetchDashboardData = () => {
        axios
            .get(`${apiList.jobs}?groupBy=month`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                const jobsData = response.data;
                setOverviewData(jobsData.overview || []);
                setOpenPositions(jobsData.openPositions || 0);
            })
            .catch((err) => console.error("Error fetching job details", err));

        axios
            .get(apiList.applications, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((response) => {
                const applicationsData = response.data;
                
                // Calculate status distribution
                const statusCounts = applicationsData.reduce((acc, app) => {
                    acc[app.status] = (acc[app.status] || 0) + 1;
                    return acc;
                }, {});

                const statusDistributionData = Object.entries(statusCounts).map(([status, value], index) => ({
                    id: status,
                    value,
                    label: status.charAt(0).toUpperCase() + status.slice(1),
                    color: pastelColors[index % pastelColors.length]
                }));

                setStatusDistribution(statusDistributionData);

                setRecentApplications(
                    applicationsData.slice(0, 5).map((application) => ({
                        ...application,
                        jobTitle: application.job ? application.job.title : "",
                    }))
                );
                setTotalApplications(applicationsData.length);
                setInterviewsScheduled(
                    applicationsData.filter((app) => app.status === "Interview Scheduled").length
                );

                const completedApplications = applicationsData.filter((app) => app.hiringDate);
                const totalDays = completedApplications.reduce(
                    (sum, app) =>
                        sum + (new Date(app.hiringDate) - new Date(app.dateOfApplication)) / (1000 * 60 * 60 * 24),
                    0
                );
                setTimeToHire(completedApplications.length ? Math.round(totalDays / completedApplications.length) : 0);
            })
            .catch((err) => console.error("Error fetching application data", err));
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const Search = () => (
        <InputBase
            placeholder="Search..."
            sx={{
                width: { md: "200px", lg: "300px" },
                border: "1px solid #ccc",
                borderRadius: 1,
                padding: "4px 12px",
            }}
        />
    );

    const RecentApplications = () => {
        const StatusChip = ({ status }) => {
            const theme = useTheme();

            const statusColors = {
                applied: theme.palette.info.main,
                shortlisted: theme.palette.warning.main,
                accepted: theme.palette.success.main,
                rejected: theme.palette.error.main,
                finished: theme.palette.text.secondary,
                cancelled: theme.palette.text.disabled,
            };

            return (
                <Chip
                    label={status}
                    sx={{
                        backgroundColor: statusColors[status] || theme.palette.grey[500],
                        color: "white",
                    }}
                />
            );
        };

        return (
            <Box>
                {recentApplications.map((application, index) => (
                    <Box
                        key={index}
                        display="flex"
                        alignItems="center"
                        marginBottom={2}
                        borderBottom="1px solid #e0e0e0"
                        paddingBottom={1}
                        width="100%"
                    >
                        <Avatar sx={{ width: 36, height: 36, marginRight: 2 }} src={application.applicantProfile || ""}>
                            {!application.applicantProfile &&
                                application.applicantName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                        </Avatar>
                        <Box flexGrow={1}>
                            <Typography variant="body1" fontWeight="medium" textTransform="capitalize">
                                {application.applicantName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" textTransform="capitalize">
                                {application.jobTitle}
                            </Typography>
                        </Box>
                        <StatusChip status={application.status} />
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <Box display="flex" flexDirection="column" height="100%">
            <Box
                borderBottom="1px solid #e0e0e0"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                padding={2}
            >
                <Typography variant="h6">Recruiter Dashboard</Typography>
                <Search />
            </Box>

            {/* Overview Section */}
            <Box padding={3} flex={1}>
                {/* Top Metrics */}
                <Grid container spacing={3} justifyContent="space-between">
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: "100%" }}>
                            <CardHeader title="Total Applications" />
                            <CardContent>
                                <Typography variant="h4">{totalApplications}</Typography>
                                <Typography color="text.secondary">+20.1% from last month</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: "100%" }}>
                            <CardHeader title="Open Positions" />
                            <CardContent>
                                <Typography variant="h4">{openPositions}</Typography>
                                <Typography color="text.secondary">+10 since last week</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: "100%" }}>
                            <CardHeader title="Interviews Scheduled" />
                            <CardContent>
                                <Typography variant="h4">{interviewsScheduled}</Typography>
                                <Typography color="text.secondary">+19% from last month</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ height: "100%" }}>
                            <CardHeader title="Time to Hire (Days)" />
                            <CardContent>
                                <Typography variant="h4">{timeToHire}</Typography>
                                <Typography color="text.secondary">-2 days from last quarter</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Bar Chart and Recent Applications Side by Side */}
                <Grid container spacing={3} marginTop={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Applications Trend" />
                            <CardContent>
                                {/* Uncomment the below section for Bar Chart */}
                                {/* <BarChart
                                    data={overviewData}
                                    xKey="month"
                                    yKey="applications"
                                    title="Applications Over Time"
                                /> */}
                                <Typography color="text.secondary">
                                    Bar chart placeholder: Displays trends in applications over time.
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Application Status Distribution" />
                            <CardContent>
                                {statusDistribution.length > 0 ? (
                                    <PieChart
                                        series={[
                                            {
                                                data: statusDistribution,
                                                highlightScope: { faded: 'global', highlighted: 'item' },
                                                faded: { innerRadius: 30, additionalRadius: -30 },
                                            },
                                        ]}
                                        slotProps={{
                                            legend: {
                                                hidden: false,
                                            },
                                        }}
                                        height={300}
                                    />
                                ) : (
                                    <Typography color="text.secondary">
                                        No application status data available
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardHeader title="Recent Applications" />
                            <CardContent>
                                <RecentApplications />
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default RecruiterDashboard;