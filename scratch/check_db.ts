import { db, collection, getDocs } from "./src/lib/firebase";

async function checkFacilities() {
  try {
    const querySnapshot = await getDocs(collection(db, "facilities"));
    console.log("Total facilities found:", querySnapshot.size);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
    
    const extrasSnapshot = await getDocs(collection(db, "facilityExtras"));
    console.log("Total facilityExtras found:", extrasSnapshot.size);
    extrasSnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  } catch (error) {
    console.error("Error checking facilities:", error);
  }
}

checkFacilities();
