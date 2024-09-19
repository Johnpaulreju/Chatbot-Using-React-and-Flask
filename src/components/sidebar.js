// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'; 

// function Sidebar({ sessions, setSessionId }) {
//   const [isOpen, setIsOpen] = useState(true);

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   return (
//     <>
//       <button onClick={toggleSidebar} style={styles.toggleButton}>
//         <FontAwesomeIcon icon={isOpen ? faTimes : faBars} /> {/* Toggle icon */}
//       </button>

//       <div style={isOpen ? styles.sidebarOpen : styles.sidebarClosed}>
//         <h3>Chat History</h3>
//         {sessions.length === 0 ? (
//           <p>No previous chats</p>
//         ) : (
//           <ul>
//             {sessions.map((session) => (
//               <li key={session} onClick={() => setSessionId(session)}>
//                 {session}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </>
//   );
// }


// const styles = {
//   toggleButton: {
//     position: 'absolute',
//     top: '10px',
//     left: '10px',
//     zIndex: 1000,
//     background: 'none',
//     border: 'none',
//     cursor: 'pointer',
//     fontSize: '20px',
//     color: '#333',
//   },
//   sidebarOpen: {
//     width: '300px',
//     height: '100%',
//     backgroundColor: '#333',
//     color: '#fff',
//     overflowY: 'auto',
//     padding: '20px',
//     transition: '0.3s',
//     zIndex: 999,
//   },
//   sidebarClosed: {
//     width: '0',
//     height: '100%',
//     overflow: 'hidden',
//     transition: '0.3s',
//   },
//   historyList: {
//     marginTop: '20px',
//     listStyleType: 'none',
//     padding: '0',
//   },
//   historyItem: {
//     padding: '10px',
//     borderBottom: '1px solid #555',
//     cursor: 'pointer',
//     color: '#fff',
//   },
// };

// export default Sidebar;

import React, { useState } from 'react';

function Sidebar({ sessions, loadSession }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <button onClick={toggleSidebar} style={styles.toggleButton}>
        {isOpen ? 'Close' : 'Open'}
      </button>

      <div style={isOpen ? styles.sidebarOpen : styles.sidebarClosed}>
        <h3>Chat History</h3>
        <ul>
          {sessions.length === 0 ? (
            <li>No previous chats</li>
          ) : (
            sessions.map((session) => (
              <li key={session} onClick={() => loadSession(session)}>
                {session}
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

const styles = {
  toggleButton: {
    position: 'absolute',
    top: '10px',
    left: '10px',
    zIndex: 1000,
  },
  sidebarOpen: {
    width: '300px',
    height: '100%',
    backgroundColor: '#333',
    color: '#fff',
    overflowY: 'auto',
    padding: '20px',
    transition: '0.3s',
  },
  sidebarClosed: {
    width: '0',
    height: '100%',
    overflow: 'hidden',
    transition: '0.3s',
  },
};

export default Sidebar;
