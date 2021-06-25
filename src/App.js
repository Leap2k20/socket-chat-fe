import io from 'socket.io-client';
import _ from 'lodash';
import { useState, useEffect, useRef, useMemo } from "react";

import { ChatList } from './ChatList'

const App = () => {
    const [ isTyping, setIsTyping ] = useState(false);
    const [ chats, setChats ] = useState([]);
    const [ message, setMessage ] = useState('');
    const [ currentUser, setCurrentUser ] = useState('');
    const socket = useRef();

    useEffect(() => {
        socket.current = io('ws://localhost:3000')

        socket.current.on('connect', () => {
            console.log('connected to server')
        })

        socket.current.on('server-typing', () => {
            setIsTyping(true)
        })

        socket.current.on('server-typing-end', () => {
            console.log('service typing end called')
            setIsTyping(false)
        })

        socket.current.on('message', (message) => {
            setChats((oldChats) => {
                return [...oldChats, message];
            })
        })
    }, [])

    const onSend = () => {
        socket.current.send({
            user: currentUser,
            message,
        })
        setChats([...chats, {
            user: currentUser,
            message,
        }])
        setMessage('')
    }

    const endTyping = useMemo(() => {
        return _.debounce(() => {
            socket.current.emit('typing-end')
        }, 1000)
    }, [])

    const onInputChange = (e) => {
        setMessage(e.target.value);
        socket.current.emit('typing')
        endTyping()
    }

    return (
        <div className="container">
            <h1>Welcome to my Chat</h1>
            <input type="text" onChange={ (e) => setCurrentUser(e.target.value) } />
            <ChatList chats={ chats } />
            { isTyping && <div>Some one is typing...</div> }
            <input type="text" onChange={ onInputChange } value={ message } />
            <button onClick={ onSend }>Send</button>
        </div>
    )
}

export default App;
