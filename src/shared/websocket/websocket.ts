// import { useState, useRef, useEffect, useCallback } from "react";
// import { p } from "vitest/dist/reporters-yx5ZTtEV.js";

// const websocket = new WebSocket(`'ws://192.21.16.14:5105/echo'`)
// websocket.onopen = () => {
//   console.log("websocket is connecting...")
// }

// const ws_path:string = 'ws://192.21.16.14:5105/echo';

// const AppWs = () => {
//   const [isPaused, setIsPaused] = useState(false);
//   const [data, setData] = useState(null);
//   const [status, setStatus] = useState("");
//   const ws = useRef(null);

//   useEffect(() => {
//       if (!isPaused) {
//             ws.current = new WebSocket(ws_path); // создаем ws соединение
//             ws.current.onopen = () => setStatus("Соединение открыто");	// callback на ивент открытия соединения
//             ws.current.onclose = () => setStatus("Соединение закрыто"); // callback на ивент закрытия соединения
//           gettingData();
//       }

//       return () => ws.current.close(); // кода меняется isPaused - соединение закрывается
//   }, [ws, isPaused]);

//   const gettingData = useCallback(() => {
//       if (!ws.current) return;

//       ws.current.onmessage = e => {                //подписка на получение данных по вебсокету
//           if (isPaused) return;
//           const message = JSON.parse(e.data);
//           setData(message);
//       };
//   }, [isPaused]);

//   return (
//       <>
//           {!!data &&
//               <div>
//                   <div>
//                       <h2>{status}</h2>
//                       <p>{`connection ID: ${data?.connectionID}`}</p>
//                       <p>{`event: ${data?.event}`}</p>
//                       <p>{`status: ${data?.status}`}</p>
//                       <p>{`version: ${data?.version}`}</p>
//                   </div>

//                   <button onclick={() => {
//                       ws.current.close();
//                       setIsPaused(!isPaused)
//                   }}>{!isPaused ? 'Остановить соединение' : 'Открыть соединение' }</button>
//               </div>
//           }
//       </>
//   )
// }

// export default AppWs;
