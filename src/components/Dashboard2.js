import React from "react";
import swal from "sweetalert";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import gmatLogo from "../images/gmatLogo.png";
import "@tensorflow/tfjs";
import "./Detections.css";
import questions from '../Questions.json';

var count_facedetect = 0;
var form_link = sessionStorage.getItem("form_link");

export default class Dashboard2 extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      timeLeft: 30 * 60,
      currentQuestionIndex: 0,
      answeredQuestions: Array(questions.questions.length).fill(false),
      visitedQuestions: Array(questions.questions.length).fill(false),
      selectedOptions: Array(questions.questions.length).fill(null),
      cheatingInstances: []
    };
    this.videoRef = React.createRef();
    this.canvasRef = React.createRef();
    this.timer = null;
    
  }

  componentDidMount() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const webCamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: "user",
            width: 500,
            height: 300
          }
        })
        .then((stream) => {
          window.stream = stream;
          this.videoRef.current.srcObject = stream;
          return new Promise((resolve) => {
            this.videoRef.current.onloadedmetadata = () => {
              resolve();
            };
          });
        });

      const modelPromise = cocoSsd.load();

      Promise.all([modelPromise, webCamPromise])
        .then((values) => {
          this.detectFrame(this.videoRef.current, values[0]);
        })
        .catch((error) => {
          console.error(error);
        });
    }

    this.timer = setInterval(() => {
      this.setState((prevState) => ({
        timeLeft: prevState.timeLeft > 0 ? prevState.timeLeft - 1 : 0
      }));
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  handleQuestionClick(questionNumber) {
    this.setState({ currentQuestionIndex: questionNumber - 1 });
  }

  handleOptionClick(option, optionIndex) {
    this.setState((prevState) => {
      const selectedOptions = [...prevState.selectedOptions];
      const answeredQuestions = [...prevState.answeredQuestions];
      selectedOptions[prevState.currentQuestionIndex] = optionIndex;
      answeredQuestions[prevState.currentQuestionIndex] = true;
      return { selectedOptions, answeredQuestions };
    });
  }

  handleNextClick = () => {
    this.setState((prevState) => {
      const visitedQuestions = [...prevState.visitedQuestions];
      visitedQuestions[prevState.currentQuestionIndex] = true;
      return {
        currentQuestionIndex:
          prevState.currentQuestionIndex < questions.questions.length - 1
            ? prevState.currentQuestionIndex + 1
            : questions.questions.length - 1,
        visitedQuestions
      };
    });
  };

  handlePreviousClick = () => {
    this.setState((prevState) => ({
      currentQuestionIndex:
        prevState.currentQuestionIndex > 0 ? prevState.currentQuestionIndex - 1 : 0
    }));
  };

  detectFrame = (video, model) => {
    model.detect(video).then((predictions) => {
      if (this.canvasRef.current) {
        this.renderPredictions(predictions);
        requestAnimationFrame(() => {
          this.detectFrame(video, model);
        });
      } else {
        return false;
      }
    });
  };

  // renderPredictions = (predictions) => {
  //   const ctx = this.canvasRef.current.getContext("2d");
  //   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  //   const font = "16px sans-serif";
  //   ctx.font = font;
  //   ctx.textBaseline = "top";

  //   predictions.forEach((prediction) => {
  //     const x = prediction.bbox[0];
  //     const y = prediction.bbox[1];
  //     const width = prediction.bbox[2];
  //     const height = prediction.bbox[3];
  //     ctx.strokeStyle = "#00FFFF";
  //     ctx.lineWidth = 2;
  //     ctx.strokeRect(x, y, width, height);
  //     ctx.fillStyle = "#00FFFF";
  //     const textWidth = ctx.measureText(prediction.class).width;
  //     const textHeight = parseInt(font, 10);
  //     ctx.fillRect(x, y, textWidth + 8, textHeight + 8);

  //     var multiple_face = 0;
  //     for (let i = 0; i < predictions.length; i++) {
  //       if (prediction.class === "person") {
  //         multiple_face = multiple_face + 1;
  //         if (multiple_face >= 2) {
  //           swal("Multiple Face Detection", "Action has been Recorded", "error");
  //         }
  //       }

  //       if (predictions[i].class === "cell phone") {
  //         swal("Cell Phone Detected", "Action has been Recorded", "error");
  //         count_facedetect = count_facedetect + 1;
  //       } else if (predictions[i].class === "book") {
  //         swal("Object Detected", "Action has been Recorded", "error");
  //         count_facedetect = count_facedetect + 1;
  //       } else if (predictions[i].class === "laptop") {
  //         swal("Object Detected", "Action has been Recorded", "error");
  //         count_facedetect = count_facedetect + 1;
  //       } else if (predictions[i].class !== "person") {
  //         swal("Face Not Visible", "Action has been Recorded", "error");
  //         count_facedetect = count_facedetect + 1;
  //       }
  //     }
  //     console.log(count_facedetect);
  //   });

  //   predictions.forEach((prediction) => {
  //     const x = prediction.bbox[0];
  //     const y = prediction.bbox[1];
  //     ctx.fillStyle = "#000000";
  //     if (
  //       prediction.class === "person" ||
  //       prediction.class === "cell phone" ||
  //       prediction.class === "book" ||
  //       prediction.class === "laptop"
  //     ) {
  //       ctx.fillText(prediction.class, x, y);
  //     }
  //   });
  //   sessionStorage.setItem("count_facedetect", count_facedetect);
  // };


  // with cheating instances
  renderPredictions = (predictions) => {
    const ctx = this.canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";
  
    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      ctx.strokeStyle = "#00FFFF";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      ctx.fillStyle = "#00FFFF";
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10);
      ctx.fillRect(x, y, textWidth + 8, textHeight + 8);
  
      let multiple_face = 0;
      for (let i = 0; i < predictions.length; i++) {
        if (prediction.class === "person") {
          multiple_face += 1;
          if (multiple_face >= 2) {
            swal("Multiple Face Detection", "Action has been Recorded", "error");
            this.recordCheatingInstance("Multiple Faces Detected", "src/CheatingInstances/image1.png");
          }
        }
  
        if (predictions[i].class === "cell phone") {
          swal("Cell Phone Detected", "Action has been Recorded", "error");
          count_facedetect += 1;
          this.recordCheatingInstance("Cell Phone Detected", "src/CheatingInstances/image1.png");
        } else if (predictions[i].class === "book") {
          swal("Object Detected", "Action has been Recorded", "error");
          count_facedetect += 1;
          this.recordCheatingInstance("Book Detected", "src/CheatingInstances/image1.png");
        } else if (predictions[i].class === "laptop") {
          swal("Object Detected", "Action has been Recorded", "error");
          count_facedetect += 1;
          this.recordCheatingInstance("Laptop Detected", "src/CheatingInstances/image1.png");
        } else if (predictions[i].class !== "person") {
          swal("Face Not Visible", "Action has been Recorded", "error");
          count_facedetect += 1;
          this.recordCheatingInstance("Face Not Visible", "src/CheatingInstances/image1.png");
        }
      }
      console.log(count_facedetect);
    });
  
    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      ctx.fillStyle = "#000000";
      if (
        prediction.class === "person" ||
        prediction.class === "cell phone" ||
        prediction.class === "book" ||
        prediction.class === "laptop"
      ) {
        ctx.fillText(prediction.class, x, y);
      }
    });
    sessionStorage.setItem("count_facedetect", count_facedetect);
  };
  
  recordCheatingInstance = (description, image) => {
    this.setState((prevState) => {
      const cheatingInstances = [...prevState.cheatingInstances, { description, image }];
      sessionStorage.setItem("cheatingInstances", JSON.stringify(cheatingInstances));
      return { cheatingInstances };
    });
  };

  handleSubmitClick = () => {
    const { selectedOptions } = this.state;
    sessionStorage.setItem("selectedOptions", JSON.stringify(selectedOptions));
    this.props.history.push("/resultPage");
  };
  render() {
    const questionNumbers = Array.from({ length: questions.questions.length }, (_, i) => i + 1);
    const { currentQuestionIndex, answeredQuestions, visitedQuestions, selectedOptions } = this.state;
    const currentQuestion = questions.questions[currentQuestionIndex];

    return (
      <div className="mainDiv">
        <div className="headline">
          <h5>Mock Test 1</h5>
          <div className="testLogo">
            <img src={gmatLogo} style={{ width: "100px" }} alt="GMAT Logo"></img>
          </div>
        </div>
        <div className="bottomDiv">
          <div className="mainQuestionDiv">
            <div className="questionleft">
              <div className="questionTab">
                <div className="questionNo">
                  <h5>Question No. {currentQuestion.questionNumber}</h5>
                </div>
                <div className="question">
                  <div className="questionMain">
                    {currentQuestion.question}
                  </div>
                  <div className="questionOptions">
                    <div className="option-container">
                      {currentQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className="option"
                          onClick={() => this.handleOptionClick(option, index)}
                          style={{
                            backgroundColor: selectedOptions[currentQuestionIndex] === index ? "#AFE1AF" : "#f0f0f0"
                          }}
                        >
                          {index + 1}. {option}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="submitButtons">
                <button className="buttons" onClick={this.handlePreviousClick}>Previous</button>
                <button className="buttons" onClick={this.handleNextClick}>Next</button>
                <button className="buttons" onClick={this.handleSubmitClick}>Submit</button>
              </div>
            </div>
          </div>
          <div className="tabsRight">
            <div className="timeLeft">
              {this.state.timeLeft !== 0 && (
                <div className="progress-bar" style={{ width: `${(this.state.timeLeft / (30 * 60)) * 100}%` }}></div>
              )}
              <p>Time Left: {this.formatTime(this.state.timeLeft)}</p>
            </div>
            <div className="videoTab">
              <video
                className="size"
                autoPlay
                playsInline
                muted
                ref={this.videoRef}
                width="500"
                height="300"
              />
              <canvas
                className="size"
                ref={this.canvasRef}
                width="500"
                height="300"
              />
            </div>
            <div className="questionPalette">
              {questionNumbers.map((number) => (
                <div
                  key={number}
                  className="questionNumber"
                  style={{
                    backgroundColor: answeredQuestions[number - 1]
                      ? "#AFE1AF"
                      : visitedQuestions[number - 1]
                        ? "#CBC3E3"
                        : "#f0f0f0" // default color for unvisited questions
                  }}
                  onClick={() => this.handleQuestionClick(number)}
                >
                  {number}
                </div>
              ))}
            </div>
            <div className="indicator-container">
                <div className="indicator" style={{backgroundColor:"#CBC3E3"}}></div>
                <h6 className="indicator-label">Visited</h6>
                <div className="indicator" style={{backgroundColor:"#AFE1AF"}}></div>
                <h6 className="indicator-label">Answered</h6>
              </div>
          </div>
        </div>
      </div>
    );
  }
}
