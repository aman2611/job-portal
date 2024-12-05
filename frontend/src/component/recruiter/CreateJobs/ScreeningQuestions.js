import React, { useContext, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { SetPopupContext } from "../../../App";
import apiList from "../../../lib/apiList";
import { useLocation } from "react-router-dom";

const ScreeningQuestions = () => {
  const { state } = useLocation();
  const formData = state?.formData;
  const setPopup = useContext(SetPopupContext);
  const navigate = useNavigate(); 

  const [questions, setQuestions] = useState([
    { question: "", answer: "", isRequired: false },
  ]);

  if (!formData) {
    return <div>No data available</div>;
  }

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index][field] = value;
      return updatedQuestions;
    });
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { question: "", answer: "", isRequired: false },
    ]);
  };

  const handleDeleteQuestion = (index) => {
    if (
      questions.length > 1 &&
      window.confirm("Are you sure you want to delete this question?")
    ) {
      setQuestions((prevQuestions) =>
        prevQuestions.filter((_, i) => i !== index)
      );
    }
  };

  const handleSubmit = () => {
    const isValid = questions.every((q) => q.question.trim() && q.answer.trim());
    if (!isValid) {
      setPopup({
        open: true,
        severity: "error",
        message: "Please fill out all questions and answers before submitting.",
      });
      return;
    }

    const dataToSend = {
      ...formData,
      questions,
    };

    axios
      .post(apiList.jobs, dataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setPopup({
          open: true,
          severity: "success",
          message: response.data?.message || "Questions submitted successfully!",
        });

        setQuestions([{ question: "", answer: "", isRequired: false }]);
        
         // Redirect to '/home' after 2 seconds
         setTimeout(() => {
          navigate("/home");
        }, 2000);

      })
      .catch((err) => {
        const errorMsg =
          err.response?.data?.message || "An error occurred. Please try again.";
        setPopup({
          open: true,
          severity: "error",
          message: errorMsg,
        });
      });
  };

  // Navigate back to the JobDetails page
  const handleBack = () => {
    navigate("/addjob"); 
  };

  return (
    <Box
      sx={{
        backgroundColor: "#f3f2ee",
        // minHeight: "100vh",
        display: "flex",
        alignItems: "flex-start",  
        justifyContent: "center",
        padding: 4,
        width: "100%",  
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: "900px", 
          // margin: "auto",
          backgroundColor: "#fff",
          boxShadow: 3,
          borderRadius: 2,
          padding: 3,
        }}
      >
        <CardHeader
          title="2 of 2: Screening Questions"
          subheader="Add screening questions to evaluate candidates"
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {questions.map((question, index) => (
              <Grid item xs={12} key={index}>
                <Card variant="outlined" sx={{ padding: 2, position: "relative" }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ pb: 2 }}>
                        Question {index + 1}
                      </Typography>
                      <TextField
                        placeholder="Enter your question here"
                        value={question.question}
                        onChange={(e) =>
                          handleQuestionChange(index, "question", e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" sx={{ pb: 2 }}>
                        Expected Answer
                      </Typography>
                      <TextField
                        placeholder="Enter expected answer here"
                        value={question.answer}
                        onChange={(e) =>
                          handleQuestionChange(index, "answer", e.target.value)
                        }
                        variant="outlined"
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteQuestion(index)}
                    sx={{ position: "absolute", top: 8, right: 8 }}
                    disabled={questions.length === 1}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Card>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddQuestion}
                sx={{ width: "auto", marginLeft: "auto", display: "block" }} // Smaller and centered
              >
                Add More Questions
              </Button>
            </Grid>
          </Grid>
        </CardContent>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleBack}
            sx={{ width: "auto" }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            sx={{ width: "auto" }}
            disabled={questions.every((q) => !q.question.trim())}
          >
            Submit
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ScreeningQuestions;
