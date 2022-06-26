import amqp from 'amqplib/callback_api';
import {client} from './lib/postgres'


interface User{
nombre:string
apellidos:string
correo:string
clave:string
dni:string
telefono:string
amigos:Array<string>

}


amqp.connect(`amqp://${process.env.HOST}:5672`, function(error0: any, connection: { createChannel: (arg0: (error1: any, channel: any) => void) => void; }) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        var queue = 'noExists';

        channel.assertQueue(queue, {
            durable: false
        });
        const success = {response:"User created"}
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, function(msg: { content: { toString: () => any; }; }) {
            console.log(" [x] Received %s", msg.content.toString());
            let data:User= JSON.parse(msg.content.toString())

            console.log(data)
            client.query(`INSERT INTO public.users (id, nombre, correo, clave, dni, telefono, amigos) VALUES(DEFAULT, '${data.nombre + data.apellidos}', '${data.correo}', '${data.clave}', '${data.dni}', ${data.telefono}, '{${data.amigos}}')`, (err: any, res: any) => {
               
                channel.sendToQueue('create', Buffer.from(JSON.stringify(success)));
              })


        }, {
            noAck: true
        });
    });
});