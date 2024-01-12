import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import { useEffect, useRef, useState } from 'react';
import PrivateRoute from './components/PrivateRoute';
import UserProfilePage from './pages/UserProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import RentalPage from './pages/RentalPage';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'universal-cookie';
import ListingDetailsPage from './pages/ListingDetailsPage';
import ChatPage from './pages/ChatPage';
import WebSocketComponent from './components/WebSocketComponent';
import MyRentalsPage from './pages/MyRentalsPage';
import AdminImageChangeRequestsPage from './pages/AdminImageChangeRequestsPage';
import ViewUserProfilePage from './pages/ViewUserProfilePage';
import TransactionPage from './pages/TransactionPage';

function App() {
    const cookies = new Cookies();
    const [jwt, setJwt] = useState(cookies.get("jwt") !== undefined ? cookies.get("jwt") : "");
    const [jwtIsValid, setJwtIsValid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [authroity, setAuthority] = useState();
    const [username, setUsername] = useState();
    const webSocketComponentRef = useRef();
    const [notification, setNotification] = useState(null);
    const [notifications, setNotifications] = useState([]);


    useEffect(() => {
      if (username && jwt) {
        fetch(`/api/notifications/${username}`, {
          headers: {
            "Authorization": `Bearer ${jwt}`,
            "Content-Type": "application/json"
          },
          method: "GET",
        })
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
        })
        .then((response) => {
          if (response) {
            setNotifications(response);
          }
        })
      }
    }, [username, jwt]);

    useEffect(() => {
      if (notification) {
        setNotifications([...notifications, notification]);
      }
    }, [notification, setNotification]);
   
    useEffect(() => {
      if (jwt !== "") {
        fetch(`/api/auth/validate?token=${jwt}`, {
          headers: {
            "Authorization": `Bearer ${jwt}`,
            "Content-Type": "application/json"
          },
          method: "GET",
        })
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
        })
        .then((data) => {
          setJwtIsValid(data);
          if (data) {
            const decoded = jwtDecode(jwt);
            cookies.set("jwt", jwt, {
              expires: new Date(decoded.exp * 1000)
            })
            setUsername(decoded.username);
          }
          else {
            cookies.remove("jwt");
            setJwt("");
          }
          setLoading(true);
        })
      }
      else {
        setJwtIsValid(false);
        setLoading(true);
      }
    })

    const onNotificationReceived = (notification) => {
      const newNotification = JSON.parse(notification.body);
      //!(newNotification.type === "IMAGE_CHANGE_REQUEST_ADMIN" && window.location.href.split("/")[4] === "image-change-requests")
      if (!(newNotification.type === "MESSAGE" && window.location.href.split("/")[3] === "chat")) {
        setNotification(newNotification);
      }
    }

    const removeNotification = (navigateTo) => {
      fetch(`/api/notifications/${notification.id}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${jwt}`,
        },
        method: "DELETE",
      });

      let tmpNotifications = notifications.filter(not => not.id !== notification.id);
      setNotifications(tmpNotifications);
      setNotification(null);

      if (navigateTo) {
        window.location.href = navigateTo;
      }
    }

  return (

        loading && 
        <>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<HomePage setNotifications={setNotifications} notifications={notifications} username={username} jwt={jwt} jwtIsValid={jwtIsValid} setJwt={setJwt} />} />
              <Route path="/register" element={<RegistrationPage jwtIsValid={jwtIsValid} setJwt={setJwt} />}/> 
              <Route path="/login" element={<LoginPage jwtIsValid={jwtIsValid} setJwt={setJwt} setUsername={setUsername}/>}/> 
              <Route path="/profile" element={
                <PrivateRoute jwt={jwt} jwtIsValid={jwtIsValid} clientRole={true} adminRole={false} >
                  <UserProfilePage setNotifications={setNotifications} notifications={notifications} jwt={jwt} username={username} jwtIsValid={jwtIsValid} setJwt={setJwt}/>
                </PrivateRoute>
              }/>
              <Route path="/rent-scooter" element={
                <PrivateRoute jwt={jwt} jwtIsValid={jwtIsValid} clientRole={true} adminRole={false}>
                  <RentalPage setNotifications={setNotifications} notifications={notifications} jwtIsValid={jwtIsValid} setJwt={setJwt} username={username} jwt={jwt}/>
                </PrivateRoute>
              }/>
              <Route path='/admin' element={
                <PrivateRoute jwt={jwt} jwtIsValid={jwtIsValid} clientRole={false} adminRole={true}>
                  <AdminDashboardPage setNotifications={setNotifications} notifications={notifications} jwt={jwt} setJwt={setJwt} username={"admin"}/>
                </PrivateRoute>
              } />
              <Route path='/admin/image-change-requests' element={
                <PrivateRoute jwt={jwt} jwtIsValid={jwtIsValid} clientRole={false} adminRole={true}>
                  <AdminImageChangeRequestsPage setNotifications={setNotifications} notifications={notifications} jwt={jwt} setJwt={setJwt} username={"admin"}/>
                </PrivateRoute>
              } />
              <Route path='/transactions' element={
                <PrivateRoute jwt={jwt} jwtIsValid={jwtIsValid} clientRole={true} adminRole={false}>
                  <TransactionPage setNotifications={setNotifications} notifications={notifications} jwt={jwt} username={username} setJwt={setJwt} jwtIsValid={jwtIsValid}/>
                </PrivateRoute>
              } />
              <Route path='/listing/:id' element={
                <ListingDetailsPage authority={authroity} setNotifications={setNotifications} notifications={notifications} username={username} jwt={jwt} jwtIsValid={jwtIsValid} setJwt={setJwt}/>
              } 
              />
              <Route path="/profile/:username" element={
                <PrivateRoute jwt={jwt} jwtIsValid={jwtIsValid} clientRole={true} adminRole={false} >
                  <ViewUserProfilePage setNotifications={setNotifications} notifications={notifications} jwt={jwt} username={username} jwtIsValid={jwtIsValid} setJwt={setJwt}/>
                </PrivateRoute>
              }/>
              <Route path='/chat' element={
                <PrivateRoute jwt={jwt} jwtIsValid={jwtIsValid} clientRole={true} adminRole={false}>
                  <ChatPage setNotifications={setNotifications} notifications={notifications} jwt={jwt} username={username} setJwt={setJwt} jwtIsValid={jwtIsValid}/>
                </PrivateRoute>
              } 
              />
              <Route path="/my-rentals" element={
                <PrivateRoute jwt={jwt} jwtIsValid={jwtIsValid} clientRole={true} adminRole={false} >
                  <MyRentalsPage setNotifications={setNotifications} notifications={notifications} jwt={jwt} username={username} jwtIsValid={jwtIsValid} setJwt={setJwt}/>
                </PrivateRoute>
              }/>
            </Routes>
          </BrowserRouter>
          <WebSocketComponent onNotificationReceived={onNotificationReceived}
              subscribeNotification={`/user/${username}/queue/notifications`} webSocketComponentRef={webSocketComponentRef}/>
        {notification &&

        <div id="default-modal" tabIndex="-1" aria-hidden="true" className="rating-modal fixed inset-0 z-50 flex items-center justify-center bg-gray-200 bg-opacity-50">
          <div className="relative p-4 w-full max-w-2xl max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                {notification.type === "MESSAGE" && <p className='text-2xl font-semibold text-center'>Nova poruka!</p>}
                {notification.type === "RENTAL" && <p className='text-2xl font-semibold text-center'>Vaš romobil je unajmljen!</p>}
                {notification.type === "IMAGE_CHANGE_REQUEST" && <p className='text-2xl font-semibold text-center'>Pristigao je zahtjev za zamjenu slike vašeg romobila!</p>}
                {notification.type === "IMAGE_CHANGE_REQUEST_ADMIN" && <p className='text-2xl font-semibold text-center'>Pristigao je zahtjev za zamjenu slike romobila!</p>}
                {notification.type === "IMAGE_CHANGE_REQUEST_REJECTED" && <p className='text-xl'>Odluka o zamjeni slike romobila!.</p>}
                {notification.type === "IMAGE_CHANGE_REQUEST_ACCEPTED" && <p className='text-xl'>Odluka o zamjeni slike romobila!</p>}
                {notification.type === "TRANSACTION" && <p className='text-xl'>Provedena je transakcija!</p>}
                {notification.type === "NEW_REGISTRATION" && <p className='text-xl'>Nova registracija!</p>}
                {notification.type === "RATING" && <p className='text-xl'>Pristigao je novi komentar za vas!</p>}
                <button 
                  onClick={() => removeNotification(null)}
                  type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                {notification.type === "MESSAGE" && <p className='text-xl'>Korisnik <span className='font-semibold'>{notification.senderUsername}</span> Vam je poslao novu poruku. Klikom na sljedeći link pogledajte poruku. 
                          <span className='font-bold text-xl cursor-pointer text-slate-800'
                              onClick={() => removeNotification("/chat")}>  Poruka</span></p>}
                {notification.type === "RENTAL" && <p className='text-xl'>Korisnik <span className='font-semibold'>{notification.senderUsername}</span> je unajmio vaš romobil.</p>}
                {notification.type === "IMAGE_CHANGE_REQUEST" && <p className='text-xl'>Korisnik <span className='font-semibold'>{notification.senderUsername}</span> je zatražio zamjenu slike jednog od vaših romobila.</p>}
                {notification.type === "IMAGE_CHANGE_REQUEST_ADMIN" && <p className='text-xl'>Korisnik <span className='font-semibold'>{notification.senderUsername}</span> je zatražio zamjenu slike jednog od romobila.
                        Klikom na sljedeći link pogledajte zamjenu. <span className='font-semibold cursor-pointer' onClick={() => removeNotification("/admin/image-change-requests")}>Zamjena</span></p>}
                {notification.type === "IMAGE_CHANGE_REQUEST_REJECTED" && <p className='text-xl'>Zahtjev za zamjenom slike romobila je odbačen.</p>}
                {notification.type === "IMAGE_CHANGE_REQUEST_ACCEPTED" && <p className='text-xl'>Zahtjev za zamjenom slike romobila je prihvaćen.</p>}
                {notification.type === "TRANSACTION" && <p className='text-xl'>Korisnik <span className='font-semibold'>{notification.senderUsername}</span> je vratio vaš romobil. Transakcija je provedena. <span className='font-semibold cursor-pointer' onClick={() => removeNotification("/transactions")}>Pregled transakcije.</span></p>}
                {notification.type === "NEW_REGISTRATION" && <p className='text-xl'>Korisnik <span className='font-semibold'>{notification.senderUsername}</span> se registrirao. <span className='font-semibold cursor-pointer' onClick={() => removeNotification("/admin")}>Pregled registracija.</span></p>}
                {notification.type === "RATING" && <p className='text-xl'>Korisnik <span className='font-semibold'>{notification.senderUsername}</span> vas je ocjenio. <span className='font-semibold cursor-pointer' onClick={() => removeNotification("/profile")}>Pregled komentara i ocjena.</span></p>}
                <div className='flex justify-end'>
                  <button className='text-white bg-slate-800 font-semibold text-lg rounded-lg cursor-pointer py-2 px-3'
                    onClick={() => removeNotification(null)}>U redu</button>
                </div> 
              </div>
          </div>
        </div>}
        </>
  );
}

export default App;
