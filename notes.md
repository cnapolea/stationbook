Node.js - 22.23.0
PostgreSQL - 17.6
Pnpm - 10.3.0
git - 2.50.1

Content-Length stores bytes not bits. It is present in the header only when content/body is present.

Browser is the one that blocks responses back from servers that do not include in ther headers the Allowed List of sites (technical term: Access-Control-Allow-Origin)

Reading Summary:

The fetch API:

Definition: It helps us make HTTP Requests and in return it gets a promise as a response. When resolved, we get the response from the server/

- The fetch API only throws on network errors. If the server returns a 404 or a 500, the fetch API does not throw; however, if you try to access the body of the response, you will get **undefined**.

Request body or response body are streams. What does this mean?

Note: I had to read more about HTTP Protocol (https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview)

- HTTP is stateless: My understanding is that I can be on Amazon and add to my basket two things. If I move from one item to the other, when I add one, then i move the other and add it, being state less, when i open the basket page i would not see my two items as these request do not share state (the browser does not know that I am the person who saved two itens). Sessions prevent this as the browser can send to the server my session id, where it will looking into my db server, check who am i and what this session holder has stored in its basket table for example.

###

Review of last reading:

HTTP alson know as Hypertext Tranfer Protocol, is a protocol use to send data through the WEB. This protocol seats at the Application level above the transport and infrastructure level.

As per what I have learned we have what they call Proxies, such as load balancers, caching, etc ... that have permission to read and sometimes alter the content of the data that is being transfered. You also have transport protocols such as TCP that is not invasive and such breaks data into packet of bytes and transfer to the intended IP destination.

We have HTTP/1.0, HTTP/1.1, HTTP/2.0, and now Google is working on QUIC.

HTTP works with what is known as the "Handshake" prior to any connection being established between the client end the server.

Client: Can we talk ?
Server: Sure, we can.
Client: Ok. Connection Started.

HTTP/1.0 Works with one connection per requests, that means that once the connection is open only one request goes through, then it is permanently closed.

This is slow in nature as the number of requests increase, why:

1. There is one handshake per connection, if there are 10 requests just to load a page, we have to open 10 connections.
2. Each connection requires around 1.5 round trip time (RTT). Which means, just for setup a connection we would be losing 1.5 x 10 = 150 Round Trips and that does not account for the time to send the data

Then HTTP/1.1 came and improved the handicap of multiple connections having to be created. Now, in the 10 requests example, we would not need to create 10 connections for each request, instead the first connection is left open and warm avoiding the 150 round trips to just 1. That alone hels a great deal. However, we still are left with one problem, these requests are in line one after the other waiting for their turn to go through this connection.

HTTP/2.0 came to fix the above issue with Multiplex / Parallelism by breaking all requests into chunks of data and send them at the same time through the connection; however, the transports (more specifically TCP) blocks them and still creates the trafic effect, as it will only let the next request in if all packets of data have beend forwarded.

###
