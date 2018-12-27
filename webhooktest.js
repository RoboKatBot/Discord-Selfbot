const https = require('https');
https.request({
		host:"discordapp.com",
		path:"/api/webhooks/367102978403991554/Lk6DN4QksDhe4oUxOd0TWH-AYJGt7ZrUcSpgHzmQlgc57CgugSBuNts0qmFoCy1Cj2sz",
		method:"POST",
		headers:{
			"Content-Type":"multipart/form-data"
		}
	}
).end(JSON.stringify({
	embeds:[{"description":"test"}]
}));
