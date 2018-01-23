class ChatController
  # HTTP
  def index # index is usually mapped to '/' -> localhost:3000/ 
    render 'welcome' # This an html template called 'welcome'
  end

  # Websockets
  def on_open
    # This function runs when the client establishes a websocket connection

    # 'Listen' to events on the "chat" channel
    subscribe channel: "chat"

    # Used to store the user's name
    @handle = params['id'.freeze] || 'Anonymous'

    # This "publishes" the message to all clients subscribed to the "chat" channel
    publish channel: "chat", message: "#{ERB::Util.html_escape @handle} has joined."
  end

  def on_message(data)
    # This function runs when a message is via a websocket connection from the client

    data = ERB::Util.html_escape data

    # Broadcast "<username> says: <message>" to all clients connected to chat
    publish channel: "chat", message: "#{@handle} says: #{data}"
  end

  def on_close
    # When a socket is closed

    # Let everyone in the chat know who left.
    publish channel: "chat", message: "#{@handle} has left."
  end

end
