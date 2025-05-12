/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable padded-blocks */
/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable quotes */
/* eslint-disable jsx-quotes */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react/self-closing-comp */
/* eslint-disable arrow-body-style */
import React from 'react'
import { GoogleLogout } from 'react-google-login'

const logout = () => {

    const onSuccess = () => {
        console.log("Log out successfull")
    }

  return (
    <div>
      <div id='signOutButton'>
        <GoogleLogout
        clientId="549323825011-0r1nidodml9re6qp7gc3773our6se63a.apps.googleusercontent.com"
        buttonText={"Logout"}
        onLogoutSuccess={onSuccess}
        />
      </div>
    </div>
  )
}

export default logout
