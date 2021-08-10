import React from "react";
import "./crestimator_website.css";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Link, useLocation} from "react-router-dom";
import ReactPlayer from "react-player";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

//Style of table cells
const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    backgroundColor: "#EEEEEE",
    fontSize: 14,
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    minWidth: 550,
  },
});

function Result() {
  const classes = useStyles();
    let location = useLocation();

    //Import the figure
    const figure = location.state.figurePath
    const frame_figure = require(`./output/${figure}`).default; 

    //Import the video
    const videoPath = location.state.path;
    const videoName = videoPath[0].split("/videos");
    const videoView = require(`./videos${videoName[1]}`).default;

	return (<>
 <div style={{ padding: 60 }}>
        <div style={{ paddingBottom: 40, color: "#EEEEEE", marginTop: 100 }}>
          <Grid item xs={12} align="center">
            <Typography
              className="font-weight-bold"
              component="h4"
              variant="h4"
              style={{
                textAlign: "center",
                textSizeAdjust: "20%",
                color: "white",
              }}
            >
              Result Report
            </Typography>
          </Grid>
        </div>

        <Grid
          container
          item
          xs={12}
          spacing={4}
          justify="center"
          alignItems="center"
        >
          <ReactPlayer url={videoView} controls autostart autoPlay />
        </Grid>
        <div
          style={{
            marginLeft: "100px",
            marginRight: "100px",
            marginTop: "30px",
          }}
        >
          <TableContainer component={Paper}>
            <Table
              className={classes.table}
              size="small"
              aria-label="a dense table"
            >
              <TableBody>
                <TableRow>
                  <StyledTableCell>
                    {" "}
                    <h4
                      style={{ fontSize: 20, color: "#595959", padding: "5px" }}
                    >
                      The name of video:{" "}
                    </h4>{" "}
                  </StyledTableCell>
                  <TableCell>
                    <h4
                      style={{
                        fontSize: 20,
                        color: "#0097A7",
                        marginRight: "300px",
                      }}
                    >
                      {location.state.name}{" "}
                    </h4>
                  </TableCell>
                  <StyledTableCell>
                    <h4
                      style={{ fontSize: 20, color: "#595959", padding: "5px" }}
                    >
                      The date of taking the video:{" "}
                    </h4>
                  </StyledTableCell>

                  <TableCell>
                    <h4 style={{ fontSize: 20, color: "#0097A7" }}>
                      {location.state.date}{" "}
                    </h4>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <StyledTableCell>
                    <h4
                      style={{ fontSize: 20, color: "#595959", padding: "5px" }}
                    >
                      The place of taking the video:{" "}
                    </h4>
                  </StyledTableCell>
                  <TableCell>
                    {" "}
                    <h4
                      style={{
                        fontSize: 20,
                        color: "#0097A7",
                        marginRight: "300px",
                      }}
                    >
                      {location.state.Placename}{" "}
                    </h4>
                  </TableCell>
                  <StyledTableCell>
                    {" "}
                    <h4
                      style={{ fontSize: 20, color: "#595959", padding: "5px" }}
                    >
                      The country where video took:{" "}
                    </h4>
                  </StyledTableCell>
                  <TableCell>
                    {" "}
                    <h4 style={{ fontSize: 20, color: "#0097A7" }}>
                      {location.state.country}{" "}
                    </h4>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <StyledTableCell>
                    {" "}
                    <h4
                      style={{ fontSize: 20, color: "#595959", padding: "5px" }}
                    >
                      The durationof contact:{" "}
                    </h4>
                  </StyledTableCell>
                  <TableCell>
                    {" "}
                    <h4
                      style={{
                        fontSize: 20,
                        color: "#0097A7",
                        marginRight: "300px",
                      }}
                    >
                      {location.state.duration} seconds
                    </h4>
                  </TableCell>
                  <StyledTableCell>
                    <h4
                      style={{ fontSize: 20, color: "#595959", padding: "5px" }}
                    >
                      The setting where video took:{" "}
                    </h4>
                  </StyledTableCell>
                  <TableCell>
                    <h4 style={{ fontSize: 20, color: "#0097A7" }}>
                      {location.state.setting}{" "}
                    </h4>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div>
          <Grid
            container
            item
            xs={12}
            spacing={3}
            justify="center"
            alignItems="center"
            style={{ marginTop: "50px", marginBottom: "50px",   marginLeft: "10px",
            marginRight: "100px", }}
          >
            <React.Fragment>
              <div className="resultBox">
                <h4 style={{ fontSize: 20, color: "#595959" }}>
                  The average number of contact:{" "}
                </h4>
                <h4
                  style={{
                    fontSize: 20,
                    color: "#595959",
                    textAlign: "center",
                  }}
                >
                  {location.state.average}
                </h4>
              </div>

              <div className="resultBox"  style={{ marginLeft:"110px", marginRight:"110px" }} >
                <h4 style={{ fontSize: 20, color: "#595959" }}>
                  The contact rate value:{" "}
                </h4>
                <h4
                  style={{
                    fontSize: 20,
                    color: "#595959",
                    textAlign: "center",
                  }}
                >
                  {location.state.contactRate}
                </h4>
              </div>

              <div className="resultBox">
                <h4 style={{ fontSize: 20, color: "#595959" }}>
                  The total number of people:{" "}
                </h4>
                <h4
                  style={{
                    fontSize: 20,
                    color: "#595959",
                    textAlign: "center",
                  }}
                >
                  {location.state.totalPeople}
                </h4>
              </div>
            </React.Fragment>
          </Grid>
        </div>

        <Grid
          container
          item
          justify="center"
          alignItems="center"
          style={{ marginTop: "30px", marginLeft: "30px" }}
        >
          <img variant="top" width="600px" height="450px" src={frame_figure} />
        </Grid> 

      
      </div>
        
           
    </>);

}
export default Result;

