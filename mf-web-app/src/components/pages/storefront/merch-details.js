import React, { useState, useEffect } from 'react';
import { useModal } from '../../../hooks/useModal';
import { ImageViewer } from '../../shared/image-viewer';
import { withAuth } from '@okta/okta-react';
import Okta from '../../../auth/Okta';
import axios from 'axios';

export default withAuth(function MerchDetails({ auth, match }) {
  const [ modalStatus, toggleModal ] = useModal();
  const [ merchDetails, setMerchDetails ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);
  let okta = new Okta();

  let merchId = match.params.merchId;

  useEffect(() => {
    const getMerch = async () => {
      const accessToken = await auth.getAccessToken();

      return await axios.GET(`/merch/${merchId}`, {headers: {
        Authorization: `Bearer ${accessToken}`
      }})
      .then((res) => JSON.parse(res.body));
    }

    try {
      setIsLoading(true);

      // const merchId = match.params.merchId;

      let response = getMerch();

      setMerchDetails(response.merch);

      console.log('merchId:  ', merchId);
      setIsLoading(false);
    } catch(err) {
      console.warn(err);
      setIsLoading(false);
    }
  }, [auth, merchId]);
  // }, [match.params.merchId]);

  if(isLoading) {
    return(
      <div>LOADING</div>
    );
  }

  return(
    <div className="merch-details">
      <ImageViewer
        isOpen={modalStatus}
        closeViewer={toggleModal}
        />
        {merchDetails}
    </div>
  );
});
