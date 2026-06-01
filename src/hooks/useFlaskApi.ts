// =============================================================================
// FILE: src/hooks/useFlaskApi.ts
// -----------------------------------------------------------------------------
// Yeh file kya karti hai?
//   Ek "custom hook" hai jo Flask server se data fetch karta hai.
//
// "Hook" kya hota hai React mein?
//   Hook ek special function hai jiske naam ki shuruaat "use" se hoti hai.
//   Yeh React ke andar "state" aur "lifecycle" features use karne deta hai.
//   Jaise: useState, useEffect — yeh sab built-in hooks hain.
//   Hum apna khud ka bhi bana sakte hain — jise "custom hook" kehte hain.
//
// "TanStack Query" kya hai?
//   Ek library hai jo server se data fetch karna, cache karna, aur
//   automatically dobara fetch karna manage karti hai — bina zyada code likhe.
//   Socho iske bina:
//     - useEffect mein fetch likho
//     - loading state manage karo
//     - error handle karo
//     - refetch implement karo
//   TanStack Query yeh sab khud karta hai!
// =============================================================================

import { useQuery } from '@tanstack/react-query';

// Apni Axios client import kar rahe hain — wahi file jo Flask se baat karegi
import apiClient from '../api/client';

// Types import kar rahe hain — hamare types/index.ts se
import { ServerStatus } from '../types';

// -----------------------------------------------------------------------------
// API FUNCTION — actual network call
// -----------------------------------------------------------------------------
// Yeh ek async function hai jo Flask server ko call karta hai.
// "async" matlab: yeh function time leta hai — result abhi nahi, thodi der mein aayega.
// "Promise" matlab: ek "vaada" ke server data dega — ya error aayega.

const fetchServerStatus = async (): Promise<ServerStatus> => {
  // apiClient.get('/api/status') matlab:
  //   HTTP GET request bhejo Flask server ke '/api/status' endpoint pe.
  //   Response mein jo data aaye use 'response.data' se nikalo.
  //
  // Flask mein yeh route kuch aisa hoga:
  //   @app.route('/api/status')
  //   def status(): return jsonify({status:'ok', message:'Running!', version:'v1'})
  const response = await apiClient.get<ServerStatus>('/api/status');

  // response.data mein actual JSON data hota hai jo server ne bheja
  return response.data;
};

// -----------------------------------------------------------------------------
// CUSTOM HOOK: useFlaskStatus
// -----------------------------------------------------------------------------
// Yeh function ek custom hook hai — React components mein directly use hota hai.
// "export" matlab: dusri files bhi import kar ke use kar sakti hain.

export const useFlaskStatus = () => {
  // useQuery() TanStack Query ka main function hai.
  // Isko teen cheezein chahiye:
  //   1. queryKey: ek unique naam/ID is query ka — caching ke liye use hota hai
  //   2. queryFn: woh function jo actually data fetch kare
  //   3. initialData: pehli baar data aane se pehle kya dikhao

  return useQuery<ServerStatus, Error>({
    // queryKey: ek array hai jo is query ki ID hai.
    // Agar koi aur bhi 'flaskStatus' key use kare, same cached data milega.
    queryKey: ['flaskStatus'],

    // queryFn: yeh woh function hai jo TanStack Query chalata hai.
    // Hum upar wala fetchServerStatus function yahan pass kar rahe hain.
    queryFn: fetchServerStatus,

    // initialData: Flask ke band hone ki situation ke liye "fallback data".
    // Is wajah se app crash nahi karti agar server off ho —
    // seedha yeh fake data dikhata hai jab tak real data na aaye.
    initialData: {
      status: 'Standby',
      message: 'Flask server se connection nahi. Make sure Flask http://127.0.0.1:5000 pe chal raha ho.',
      version: 'v0.1.0',
    },

    // retry: agar request fail ho, kitni baar dobara try kare?
    // 1 baar — zyada spam nahi karna server ko
    retry: 1,
  });
};

export default useFlaskStatus;
