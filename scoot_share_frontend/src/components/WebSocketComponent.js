import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import {Stomp} from '@stomp/stompjs';

const WebSocketComponent = (props) => {
    const {webSocketComponentRef, subscribeCustom, onMessageReceivedCustom, userIChatWith, 
        subscribeNotification, onNotificationReceived, children} = {...props};
    const [stompClient, setStompClient] = useState(null);
    const webSocketOpened = useRef(false);

    useEffect(() => {
        if (!stompClient && !webSocketOpened.current) {
            webSocketOpened.current = true;
            const initializeStomp = () => {
                if (!stompClient) {
                    const socket = new SockJS('https://test-scoot-share.onrender.com/ws');
                    const stomp = Stomp.over(socket);
                    //stomp.debug = null; // prevents stomp from printing messages to console
                    stomp.connect({}, () => setStompClient(stomp));
                }
            }
    
            initializeStomp();
    
            return;
        }

    }, [stompClient]);

    useEffect(() => {
        if (stompClient && stompClient.connected) {
            if (subscribeCustom) {
                stompClient.subscribe(subscribeCustom, (message) => {
                    if (onMessageReceivedCustom) {
                        onMessageReceivedCustom(message, userIChatWith);
                    }
                });   
            }
            if (subscribeNotification) {
                stompClient.subscribe(subscribeNotification, (notification) => {
                    onNotificationReceived(notification);
                });   
            }
        }
    }, [stompClient, setStompClient]);

    const sendMessage = (message) => {
        if (stompClient) {
            stompClient.send("/app/chat", {}, JSON.stringify(message));
        }
    }

    useEffect(() => {
        if (stompClient) {
            webSocketComponentRef.current = {
                sendMessage
              };
        }
    }, [stompClient]);

    return children;
};

export default WebSocketComponent;