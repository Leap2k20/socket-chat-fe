export const ChatList = ({ chats }) => {

    return (
        <div>
            {
                chats.map(({ user, message }, i) => {
                    if (user === 'zori') {
                        return (
                            <div style={{backgroundColor: 'red'}} key={ i }>{ user }: { message }</div>
                        )
                    }
                    return (
                        <div style={{backgroundColor: 'green'}} key={ i }>{ user }: { message }</div>
                    )
                })
            }
        </div>
    )
}
