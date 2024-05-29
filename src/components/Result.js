import React, { useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import 'react-image-lightbox/style.css';
import './Result.css';

const Result = () => {
  const selectedOptions = JSON.parse(sessionStorage.getItem('selectedOptions')) || [];
  const countFacedetect = JSON.parse(sessionStorage.getItem('count_facedetect')) || 0;
  const cheatingInstances = JSON.parse(sessionStorage.getItem('cheatingInstances')) || [];

  const data = [
    { name: 'Correct Answers', value: selectedOptions.filter(option => option !== null).length },
    { name: 'Wrong Answers', value: selectedOptions.length - selectedOptions.filter(option => option !== null).length }
  ];

  const COLORS = ['#00C49F', '#FF8042'];

  useEffect(() => {
    return () => {
      sessionStorage.removeItem('count_facedetect');
      sessionStorage.removeItem('cheatingInstances');
    };
  }, []);

  return (
    <div className="mainContainer">
      <h2 className="title">Test Results</h2>
      <div className="contentContainer">
        <div className="chartContainer">
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx={200}
              cy={200}
              labelLine={false}
              label
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>

        <div className="tableWrapper">
          <h3 className="cheatingTitle">Instances of Cheating: {countFacedetect}</h3>
          <TableContainer component={Paper} className="tableContainer">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>Image</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className="tableBody">
                {cheatingInstances.map((instance, index) => (
                  <TableRow key={index}>
                    <TableCell>{instance.description}</TableCell>
                    <TableCell><img src={instance.image} alt={`Cheating instance ${index + 1}`} className="cheatingImage" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Result;
