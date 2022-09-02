import logo from './logo.svg';
import './App.css';
import React, { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import Switch from '@mui/material/Switch';
import useState from 'react-usestateref';

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Legend,
  PointElement,
  zoomPlugin
);
const optionAcc = {
  responsive: true,
  bezierCurve: true,

  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Acceleration'
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'x'
      },
      pan: {
        enabled: true,
        mode: 'x',
        overScaleMode: 'y',
        threshold: 100
      }
    }
  }
};
const optionsAttitude = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Attitude'
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'x'
      },
      pan: {
        enabled: true,
        mode: 'x',
        overScaleMode: 'y',
        threshold: 100
      }
    }
  }
};
const optionsGravAcc = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Gravitational Acceleration'
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'x'
      },
      pan: {
        enabled: true,
        mode: 'x',
        overScaleMode: 'y',
        threshold: 100
      }
    }
  }
};
const optionsQuater = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Quaternion'
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'x'
      },
      pan: {
        enabled: true,
        mode: 'x',
        overScaleMode: 'y',
        threshold: 100
      }
    }
  }
};
const optionsRotRate = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Rotation Rate'
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true
        },
        pinch: {
          enabled: true
        },
        mode: 'x'
      },
      pan: {
        enabled: true,
        mode: 'x',
        overScaleMode: 'y',
        threshold: 100
      }
    }
  }
};

let ws;
function App() {
  const [accelData, setAccelerationData] = React.useState([]);
  const [attitude, setAttitude] = React.useState([]);
  const [gravitational, setGravitational] = React.useState([]);
  const [quaternion, setQuaternion] = React.useState([]);
  const [rotationRate, setRotationRate] = React.useState([]);
  const [isZoomActive, setIsZoomActive, isZoomActiveRef] = useState(false);
  const [extraZoom, setExtraZoom, extraZoomRef] = useState(0);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const labels = Array.from(Array(accelData.length).keys());
  const chartRefAcc = React.useRef(null);
  const chartRefAtt = React.useRef(null);
  const chartRefGrav = React.useRef(null);
  const chartRefQuat = React.useRef(null);
  const chartRefRot = React.useRef(null);

  let AccelerationData = {
    labels,
    datasets: [
      {
        label: 'X',
        data: accelData.map(data => Number(data.x)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      },
      {
        label: 'Y',
        data: accelData.map(data => Number(data.y)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      },
      {
        label: 'Z',
        data: accelData.map(data => Number(data.z)),
        borderColor: 'rgb(143 227 207)',
        backgroundColor: 'rgba(143, 227,207, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      }
    ]
  };

  let AttitudeData = {
    labels,
    datasets: [
      {
        label: 'Pitch',
        data: attitude.map(data => Number(data.pitch)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      },
      {
        label: 'Roll',
        data: attitude.map(data => Number(data.roll)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      },
      {
        label: 'Yaw',
        data: attitude.map(data => Number(data.yaw)),
        borderColor: 'rgb(143 227 207)',
        backgroundColor: 'rgba(143, 227,207, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      }
    ]
  };
  let GravAccData = {
    labels,
    datasets: [
      {
        label: 'X',
        data: gravitational.map(data => Number(data.x)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      },
      {
        label: 'Y',
        data: gravitational.map(data => Number(data.y)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      },
      {
        label: 'Z',
        data: gravitational.map(data => Number(data.z)),
        borderColor: 'rgb(143 227 207)',
        backgroundColor: 'rgba(143, 227,207, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      }
    ]
  };

  let QuaternionData = {
    labels,
    datasets: [
      {
        label: 'X',
        data: quaternion.map(data => Number(data.x)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      },
      {
        label: 'Y',
        data: gravitational.map(data => Number(data.y)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      },
      {
        label: 'Z',
        data: gravitational.map(data => Number(data.z)),
        borderColor: 'rgb(143 227 207)',
        backgroundColor: 'rgba(143, 227,207, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      },
      {
        label: 'W',
        data: gravitational.map(data => Number(data.w)),
        borderColor: 'rgb(143 100 207)',
        backgroundColor: 'rgba(143, 100,207, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      }
    ]
  };

  let rotationRateData = {
    labels,
    datasets: [
      {
        label: 'X',
        data: rotationRate.map(data => Number(data.x)),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      },
      {
        label: 'Y',
        data: rotationRate.map(data => Number(data.y)),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      },
      {
        label: 'Z',
        data: rotationRate.map(data => Number(data.z)),
        borderColor: 'rgb(143 227 207)',
        backgroundColor: 'rgba(143, 227,207, 0.5)',
        pointRadius: 0,
        lineTension: 0.2
      }
    ]
  };

  // useEffect(() => {
  //   console.log(accelData.map(data => Number(data.x)));
  //   AccelerationData.datasets[0].data = accelData.map(data => Number(data.x));
  //   AccelerationData.datasets[1].data = accelData.map(data => Number(data.y));
  // }, [accelData]);

  useEffect(() => {
    startWebSocket();
  }, []);

  const startWebSocket = () => {
    console.log('Websocket started.');
    ws = new WebSocket(`ws://stark-shore-79011.herokuapp.com/:8080`);
    setIsSocketConnected(true);

    ws.onmessage = e => {
      var msg = JSON.parse(e.data);

      handleReceive(msg);
      setIsSocketConnected(true);
    };
    ws.onclose = e => {
      console.log('Reconnecting: ', e.message);
      setIsSocketConnected(false);
      setTimeout(startWebSocket, 5000);
    };

    ws.onerror = e => {
      setIsSocketConnected(false);
      console.log(`Error: ${e.message}`);
    };
  };

  const handleReceive = receivedMsg => {
    if (isZoomActiveRef.current) {
      chartRefAcc.current.pan(-50);
      chartRefAtt.current.pan(-50);
      chartRefGrav.current.pan(-50);
      chartRefQuat.current.pan(-50);
      chartRefRot.current.pan(-50);
    }

    setAccelerationData(prev => [...prev, receivedMsg.acceleration]);
    setAttitude(prev => [...prev, receivedMsg.attitude]);
    setGravitational(prev => [...prev, receivedMsg.gravitationalAcc]);
    setQuaternion(prev => [...prev, receivedMsg.quaternion]);
    setRotationRate(prev => [...prev, receivedMsg.rotationRate]);
  };

  const zoomManager = () => {
    setIsZoomActive(true);

    chartRefAcc.current.zoom(
      {
        x: 1.3 + extraZoomRef.current
      },
      'active'
    );
    chartRefAtt.current.zoom(
      {
        x: 1.3 + extraZoomRef.current
      },
      'active'
    );
    chartRefGrav.current.zoom(
      {
        x: 1.3 + extraZoomRef.current
      },
      'active'
    );
    chartRefQuat.current.zoom(
      {
        x: 1.3 + extraZoomRef.current
      },
      'active'
    );
    chartRefRot.current.zoom(
      {
        x: 1.3 + extraZoomRef.current
      },
      'active'
    );
  };
  return (
    <div className='App'>
      <div class='container text-center'>
        <div class='row'>
          <div class='col'>
            <Line
              ref={chartRefAcc}
              options={optionAcc}
              data={AccelerationData}
            />
          </div>
          <div class='col'>
            <Line
              ref={chartRefAtt}
              options={optionsAttitude}
              data={AttitudeData}
            />
          </div>
        </div>
        <div class='row'>
          <div class='col'>
            <Line
              ref={chartRefGrav}
              options={optionsGravAcc}
              data={GravAccData}
            />
          </div>
          <div class='col'>
            <Line
              ref={chartRefQuat}
              options={optionsQuater}
              data={QuaternionData}
            />
          </div>
        </div>
        <div class='row'>
          <div class='col'>
            <Line
              ref={chartRefRot}
              options={optionsRotRate}
              data={rotationRateData}
            />
          </div>
          <div class='col control-panel'>
            <Switch
              label={'zoom'}
              onChange={v => {
                if (v.target.checked === false) {
                  setIsZoomActive(false);
                  chartRefAcc.current.resetZoom();
                  chartRefAtt.current.resetZoom();
                  chartRefGrav.current.resetZoom();
                  chartRefQuat.current.resetZoom();
                  chartRefRot.current.resetZoom();
                  chartRefAcc.current.pan(0);
                  chartRefAtt.current.pan(0);
                  chartRefGrav.current.pan(0);
                  chartRefQuat.current.pan(0);
                  chartRefRot.current.pan(0);
                } else {
                  zoomManager();
                }
              }}
            />
            <div>
              <p style={{ color: 'white' }}>Zoom</p>
            </div>
            <button
              onClick={() => {
                setExtraZoom(prev => prev - 0.05);
                zoomManager();
              }}
            >
              Minus
            </button>
            <button
              onClick={() => {
                setExtraZoom(prev => prev + 0.05);
                zoomManager();
              }}
            >
              Plus
            </button>
            <div>
              <p style={{ color: 'white' }}>
                Current zoom: {chartRefAcc?.current?.getZoomLevel()}
              </p>
              <p style={{ color: 'white' }}>
                Is Socket Alive: {isSocketConnected ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
