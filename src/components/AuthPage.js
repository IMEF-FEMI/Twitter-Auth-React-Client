import React, { useEffect} from 'react';
import Spinner from './Spinner'
import axios from 'axios'
import qs from 'query-string'
 
export default function SignIn(props){

	useEffect(() => {
	const query = qs.parse(props.location.search, { ignoreQueryPrefix: true })

	if (query.oauth_token === localStorage.getItem("oauthRequestToken")) {

			axios.get(`https://twitter-3legged-server.herokuapp.com/callback/${localStorage.getItem("oauthRequestToken")}/${localStorage.getItem("oauthRequestTokenSecret")}/${query.oauth_verifier}`)
			.then(response=>{
				if (response.data.oauthAccessToken) {
					axios.get(`https://twitter-3legged-server.herokuapp.com/verify/${response.data.oauthAccessToken}/${response.data.oauthAccessTokenSecret}`)
					.then(res=>{
						const { user } = res.data
						const keys = response.data

						const userInfo = {
			          	accessToken: keys.oauthAccessToken,
	            		secret: keys.oauthAccessTokenSecret,
	            		user_id: user.id_str,
			            screen_name: user.screen_name,
			            photo: user.profile_image_url_https.replace("_normal", ""),
			          }

			           props.history.push({
				        pathname: "/home",
				        state:{
				        	user: userInfo
				        }
				      });

					})
				}
			}).catch(err=>{
			 alert("authentication error")
					props.history.push({
			        pathname: "/",
			      });
			})
	}else{
		alert("authentication error")
		// authentication error
		props.history.push({
	        pathname: "/",
	      });
		}
	}, [props.location.search, props.history]);
	return (
		<div className='App-header '>
			<Spinner/>
			<h2> Authenticating... </h2>
		</div>
	)
}