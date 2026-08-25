// import { useEffect, useState } from "react";



// import "./ownerdashboard.css";

// import "./addmember.css";





// function OwnerDashboard({onLogout}){





// const [members,setMembers] = useState([]);



// const [loadingMembers,setLoadingMembers] = useState(true);





// const [insideMembers,setInsideMembers] = useState(0);



// const [showCheckIn,setShowCheckIn] = useState(false);





// const [showAddMember,setShowAddMember] = useState(false);



// const [showCredentials,setShowCredentials] = useState(false);







// const [credentials,setCredentials] = useState({



// email:"",

// password:""



// });







// const [formData,setFormData] = useState({



// name:"",

// email:"",

// phone:"",

// plan:"Starter",

// feesPaid:1999



// });











// const API = "http://localhost:5001/api/members";











// const capacity = 80;



// const availableSpots = capacity - insideMembers;











// // FETCH MEMBERS



// const fetchMembers = async()=>{





// try{





// setLoadingMembers(true);





// const res = await fetch(API);





// const data = await res.json();





// setMembers(data.members || []);







// }



// catch(error){



// console.log(error);



// }





// finally{



// setLoadingMembers(false);



// }





// };













// useEffect(()=>{



// fetchMembers();



// },[]);















// // DELETE MEMBER





// const handleDeleteMember = async(id)=>{





// const confirmDelete = window.confirm(

// "Delete this member?"

// );





// if(!confirmDelete)

// return;







// try{





// const res = await fetch(



// `${API}/${id}`,



// {



// method:"DELETE"



// }



// );







// if(res.ok){



// fetchMembers();



// }







// }



// catch(error){



// console.log(error);



// }







// };

















// // FORM CHANGE





// const handleChange=(e)=>{





// setFormData({



// ...formData,



// [e.target.name]:e.target.value



// });





// };

















// // ADD MEMBER





// const handleAddMember = async(e)=>{





// e.preventDefault();





// try{





// const res = await fetch(



// API,



// {



// method:"POST",



// headers:{



// "Content-Type":"application/json"



// },



// body:JSON.stringify(formData)



// }



// );







// const data = await res.json();







// if(res.ok){





// setCredentials({



// email:data.credentials.email,



// password:data.credentials.temporaryPassword



// });





// setShowAddMember(false);



// setShowCredentials(true);





// fetchMembers();







// setFormData({



// name:"",

// email:"",

// phone:"",

// plan:"Starter",

// feesPaid:1999



// });





// }







// }



// catch(error){



// console.log(error);



// }





// };















// const formatCurrency=(amount)=>{





// return `₹${Number(amount).toLocaleString("en-IN")}`;





// };









// const totalFees = members.reduce(



// (sum,m)=>sum+Number(m.feesPaid || 0),



// 0



// );







// const activeMembers = members.filter(



// m=>m.status==="Active"



// ).length;











// return (



// <div className="owner-dashboard">





// <aside className="owner-sidebar">





// <div className="owner-logo">



// THE<span>LIFT</span>



// </div>







// <nav className="owner-nav">





// <button className="owner-nav-item active">



// <span>▦</span>



// Dashboard



// </button>







// <button className="owner-nav-item">



// <span>♙</span>



// Members



// </button>







// <button className="owner-nav-item">



// <span>◉</span>



// Attendance



// </button>







// <button className="owner-nav-item">



// <span>₹</span>



// Payments



// </button>







// </nav>



// <div className="owner-sidebar-bottom">





// <button

// className="owner-nav-item logout-btn"

// onClick={onLogout}

// >



// <span>

// ↪

// </span>



// Logout



// </button>







// <div className="owner-profile">





// <div className="owner-avatar">

// O

// </div>





// <div>



// <strong>

// The Lift Owner

// </strong>





// <span>

// Owner

// </span>





// </div>





// </div>







// </div>





// </aside>













// <main className="owner-main">











// <header className="owner-header">





// <div>





// <p className="dashboard-label">

// MANAGEMENT PANEL

// </p>





// <h1>

// The Lift <span>Dashboard</span>

// </h1>





// <p className="dashboard-subtitle">



// Manage your gym, members and daily operations.



// </p>







// </div>









// <div className="live-status">



// LIVE



// </div>







// </header>



















// <section className="overview-grid">











// <div className="stat-card">





// <p>

// MEMBERS

// </p>





// <h2>

// {members.length}

// </h2>





// <span>

// Registered members

// </span>





// </div>















// <div className="stat-card">





// <p>

// AVAILABLE SPOTS

// </p>





// <h2>

// {availableSpots}

// </h2>





// <span>

// Out of {capacity}

// </span>





// </div>















// <div className="stat-card">





// <p>

// FEES COLLECTED

// </p>





// <h2>

// {formatCurrency(totalFees)}

// </h2>





// <span>

// Total recorded fees

// </span>





// </div>















// <div className="stat-card">





// <p>

// ACTIVE MEMBERS

// </p>





// <h2>

// {activeMembers}

// </h2>





// <span>

// Currently active

// </span>





// </div>











// </section>























// <section className="dashboard-grid">











// <div className="dashboard-panel">







// <p className="panel-label">

// LIVE NOW

// </p>







// <h2>

// Gym Capacity

// </h2>











// <div className="capacity-big-number">





// <strong>



// {insideMembers}



// </strong>







// <span>



// / {capacity} people



// </span>







// </div>















// <div className="capacity-track">





// <div



// className="capacity-fill"



// style={{



// width:`${(insideMembers/capacity)*100}%`



// }}



// />





// </div>















// <div className="capacity-info">











// <div>





// <strong>



// {insideMembers}



// </strong>





// <span>

// Currently Inside

// </span>





// </div>















// <div>





// <strong>



// {availableSpots}



// </strong>





// <span>

// Spots Available

// </span>





// </div>











// </div>













// </div>























// <div className="dashboard-panel">







// <p className="panel-label">



// MANAGEMENT



// </p>







// <h2>



// Quick Actions



// </h2>















// <div className="quick-actions">











// <button



// onClick={()=>setShowAddMember(true)}



// >





// <span>

// +

// </span>





// <div>



// <strong>

// Add Member

// </strong>





// <small>

// Create a new member account

// </small>





// </div>





// </button>



















// <button>





// <span>

// ₹

// </span>





// <div>



// <strong>

// Record Payment

// </strong>





// <small>

// Record membership payment

// </small>





// </div>





// </button>



















// <button



// onClick={()=>setShowCheckIn(true)}



// >





// <span>

// ◉

// </span>





// <div>



// <strong>

// Check In Member

// </strong>





// <small>

// Mark member as inside

// </small>





// </div>





// </button>











// </div>















// </div>















// </section>



























// <section className="members-section">







// <p className="panel-label">



// MEMBERS



// </p>







// <h2>

// Recent Members

// </h2>













// <div className="members-table">











// <div className="table-head">





// <span>

// #

// </span>





// <span>

// MEMBER

// </span>





// <span>

// EMAIL

// </span>





// <span>

// PLAN

// </span>





// <span>

// FEES
// </span>

// <span>
// STATUS
// </span>
// <span>
// ACTION
// </span>
// </div>
// {
// loadingMembers ? (
// <div>
// Loading...
// </div>
// )
// :
// members.map((member,index)=>(
// <div
// className="member-row"
// key={member._id}
// >
// <span className="member-number">
// {index+1}
// </span>
// <span className="member-name">
// {member.name}
// </span>
// <span>
// {member.email}
// </span>
// <span>
// {member.plan}
// </span>
// <span>
// {formatCurrency(member.feesPaid)}
// </span>
// <span className="member-status">
// {member.inside ? "Inside Gym" : member.status}
// </span>
// <button
// className="delete-member-btn"
// onClick={()=>handleDeleteMember(member._id)}
// >
// Delete
// </button>
// </div>
// ))
// }
// </div>
// </section>
// {
// showAddMember && (
// <div className="add-member-overlay">
// <div className="add-member-modal">
// <h2>
// Add New Member
// </h2>
// <p className="add-member-description">
// Create a new gym member account
// </p>
// <form onSubmit={handleAddMember}>
// <div className="add-member-field">
// <label>
// Full Name
// </label>
// <input
// name="name"
// value={formData.name}
// onChange={handleChange}
// placeholder="Enter member name"
// />
// </div>
// <div className="add-member-field">
// <label>
// Email
// </label>
// <input
// name="email"
// value={formData.email}
// onChange={handleChange}
// placeholder="Enter email"
// />
// </div>
// <div className="add-member-row">
// <div className="add-member-field">
// <label>
// Phone
// </label>
// <input
// name="phone"
// value={formData.phone}
// onChange={handleChange}
// placeholder="Phone number"
// />
// </div>
// <div className="add-member-field">
// <label>
// Plan
// </label>
// <select
// name="plan"
// value={formData.plan}
// onChange={handleChange}
// >
// <option>
// Starter
// </option>
// <option>
// Premium
// </option>
// <option>
// Elite
// </option>
// </select>
// </div>
// </div>
// <div className="add-member-field">
// <label>
// Fees Paid
// </label>
// <input
// type="number"
// name="feesPaid"
// value={formData.feesPaid}
// onChange={handleChange}
// />
// </div>
// <div className="add-member-actions">
// <button
// type="button"
// className="add-member-cancel"
// onClick={()=>setShowAddMember(false)}
// >
// Cancel
// </button>
// <button
// type="submit"
// className="add-member-submit"
// >
// Create Member
// </button>
// </div>
// </form>
// </div>
// </div>
// )
// }
// {
// showCredentials && (
// <div className="add-member-overlay">
// <div className="add-member-modal">
// <h2>
// Member Created
// </h2>
// <p className="add-member-description">
// Save these login credentials
// </p>
// <div className="credentials-box">
// <div className="credential-item">
// <span>
// Email
// </span>
// <strong>
// {credentials.email}
// </strong>
// </div>
// <div className="credential-item">
// <span>
// Temporary Password
// </span>
// <strong>
// {credentials.password}
// </strong>
// </div>
// </div>
// <div className="add-member-actions">
// <button
// className="add-member-submit"
// onClick={()=>setShowCredentials(false)}
// >
// Done
// </button>
// </div>
// </div>
// </div>
// )
// }
// {
// showCheckIn && (
// <div className="modal-overlay" onClick={()=>setShowCheckIn(false)}>
// <div className="checkin-modal" role="dialog" aria-modal="true" aria-labelledby="checkin-title" onClick={(event)=>event.stopPropagation()}>
// <div className="modal-header">
// <div>
// <h2 id="checkin-title">
// Check In Member
// </h2>
// <p>
// Select a member to mark them as currently inside the gym.
// </p>
// </div>
// <button className="modal-close" type="button" aria-label="Close check-in dialog" onClick={()=>setShowCheckIn(false)}>
// ×
// </button>
// </div>
// <div className="checkin-members">
// {
// members.map((member)=>(
// <button
// key={member._id}
// className="checkin-member-card"
// type="button"
// disabled={member.inside || insideMembers >= capacity}
// onClick={()=>{
// if(member.inside)
// return;
// setInsideMembers(prev =>
// prev < capacity ? prev+1 : prev
// );
// setMembers(prev =>
// prev.map(m=>
// m._id===member._id
// ?
// {...m,inside:true}
// :
// m
// )
// );
// setShowCheckIn(false);
// }}
// >
// <div className="member-avatar">
// {member.name.charAt(0)}
// </div>
// <div className="checkin-info">
// <strong>
// {member.name}
// </strong>
// <small>
// {member.inside ? "Already checked in" : `${member.plan} Plan`}
// </small>
// </div>
// <span className="checkin-btn">
// {member.inside ? "Inside" : "Check In"}
// </span>
// </button>
// ))
// }
// </div>
// <div className="modal-actions">
// <button className="modal-cancel" type="button" onClick={()=>setShowCheckIn(false)}>
// Cancel
// </button>
// </div>
// </div>
// </div>
// )
// }
// </main>
// </div>
// );
// }
// export default OwnerDashboard;

import { useEffect, useState } from "react";

import "./ownerdashboard.css";
import "./addmember.css";


function OwnerDashboard({ onLogout }) {

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  const [insideMembers, setInsideMembers] = useState(0);
  const [showCheckIn, setShowCheckIn] = useState(false);

  const [showAddMember, setShowAddMember] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "Starter",
    feesPaid: 1999,
  });

  const API = "http://localhost:5001/api/members";
  const ATTENDANCE_API = "http://localhost:5001/api/attendance";

  const capacity = 80;
  const availableSpots = capacity - insideMembers;


  // FETCH MEMBERS

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);

      const res = await fetch(API);
      const data = await res.json();

      setMembers(data.members || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingMembers(false);
    }
  };


  // FETCH LIVE CAPACITY

  const fetchCapacity = async () => {
    try {
      const res = await fetch(`${ATTENDANCE_API}/today`);
      const data = await res.json();

      setInsideMembers(data.inside || 0);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchMembers();
    fetchCapacity();
  }, []);


  // DELETE MEMBER

  const handleDeleteMember = async (id) => {
    const confirmDelete = window.confirm("Delete this member?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.log(error);
    }
  };


  // FORM CHANGE

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // ADD MEMBER

  const handleAddMember = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setCredentials({
          email: data.credentials.email,
          password: data.credentials.temporaryPassword,
        });

        setShowAddMember(false);
        setShowCredentials(true);

        fetchMembers();

        setFormData({
          name: "",
          email: "",
          phone: "",
          plan: "Starter",
          feesPaid: 1999,
        });
      } else {
        alert(data.message || "Failed to create member");
      }
    } catch (error) {
      console.log(error);
      alert("Could not reach server. Is the backend running?");
    }
  };


  // CHECK IN / CHECK OUT MEMBER

// CHECK IN / CHECK OUT MEMBER
const handleCheckInToggle = async (member) => {
  try {
    const isInside = member.currentlyInside === true;

    const endpoint = isInside
      ? `${ATTENDANCE_API}/checkout`
      : `${ATTENDANCE_API}/checkin`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        member: member._id,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Attendance operation failed");
    }

    // Update member status immediately
    setMembers((prev) =>
      prev.map((m) =>
        m._id === member._id
          ? {
              ...m,
              currentlyInside: !isInside,
            }
          : m
      )
    );

    // Update live capacity
    setInsideMembers(Number(data.inside || 0));

    // Get latest backend data
    await fetchMembers();
    await fetchCapacity();

  } catch (error) {
    console.error("Attendance error:", error);
    alert(error.message || "Unable to update attendance");
  }
};

  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };


  const totalFees = members.reduce(
    (sum, m) => sum + Number(m.feesPaid || 0),
    0
  );

  const activeMembers = members.filter(
    (m) => m.status === "Active"
  ).length;


  return (
    <div className="owner-dashboard">
      <aside className="owner-sidebar">
        <div className="owner-logo">
          THE<span>LIFT</span>
        </div>

        <nav className="owner-nav">
          <button className="owner-nav-item active">
            <span>▦</span>
            Dashboard
          </button>

          <button className="owner-nav-item">
            <span>♙</span>
            Members
          </button>

          <button className="owner-nav-item">
            <span>◉</span>
            Attendance
          </button>

          <button className="owner-nav-item">
            <span>₹</span>
            Payments
          </button>
        </nav>

        <div className="owner-sidebar-bottom">
          <button className="owner-nav-item logout-btn" onClick={onLogout}>
            <span>↪</span>
            Logout
          </button>

          <div className="owner-profile">
            <div className="owner-avatar">O</div>

            <div>
              <strong>The Lift Owner</strong>
              <span>Owner</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="owner-main">
        <header className="owner-header">
          <div>
            <p className="dashboard-label">MANAGEMENT PANEL</p>

            <h1>
              The Lift <span>Dashboard</span>
            </h1>

            <p className="dashboard-subtitle">
              Manage your gym, members and daily operations.
            </p>
          </div>

          <div className="live-status">LIVE</div>
        </header>

        <section className="overview-grid">
          <div className="stat-card">
            <p>MEMBERS</p>
            <h2>{members.length}</h2>
            <span>Registered members</span>
          </div>

          <div className="stat-card">
            <p>AVAILABLE SPOTS</p>
            <h2>{availableSpots}</h2>
            <span>Out of {capacity}</span>
          </div>

          <div className="stat-card">
            <p>FEES COLLECTED</p>
            <h2>{formatCurrency(totalFees)}</h2>
            <span>Total recorded fees</span>
          </div>

          <div className="stat-card">
            <p>ACTIVE MEMBERS</p>
            <h2>{activeMembers}</h2>
            <span>Currently active</span>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="dashboard-panel">
            <p className="panel-label">LIVE NOW</p>

            <h2>Gym Capacity</h2>

            <div className="capacity-big-number">
              <strong>{insideMembers}</strong>
              <span>/ {capacity} people</span>
            </div>

            <div className="capacity-track">
              <div
                className="capacity-fill"
                style={{
                  width: `${(insideMembers / capacity) * 100}%`,
                }}
              />
            </div>

            <div className="capacity-info">
              <div>
                <strong>{insideMembers}</strong>
                <span>Currently Inside</span>
              </div>

              <div>
                <strong>{availableSpots}</strong>
                <span>Spots Available</span>
              </div>
            </div>
          </div>

          <div className="dashboard-panel">
            <p className="panel-label">MANAGEMENT</p>

            <h2>Quick Actions</h2>

            <div className="quick-actions">
              <button onClick={() => setShowAddMember(true)}>
                <span>+</span>
                <div>
                  <strong>Add Member</strong>
                  <small>Create a new member account</small>
                </div>
              </button>

              <button>
                <span>₹</span>
                <div>
                  <strong>Record Payment</strong>
                  <small>Record membership payment</small>
                </div>
              </button>

              <button onClick={() => setShowCheckIn(true)}>
                <span>◉</span>
                <div>
                  <strong>Check In / Out Member</strong>
                  <small>Mark member as inside or outside</small>
                </div>
              </button>
            </div>
          </div>
        </section>

        <section className="members-section">
          <p className="panel-label">MEMBERS</p>

          <h2>Recent Members</h2>

          <div className="members-table">
            <div className="table-head">
              <span>#</span>
              <span>MEMBER</span>
              <span>EMAIL</span>
              <span>PLAN</span>
              <span>FEES</span>
              <span>STATUS</span>
              <span>ACTION</span>
            </div>
            {loadingMembers ? (
              <div>Loading...</div>
            ) : (
              members.map((member, index) => (
                <div className="member-row" key={member._id}>
                  <span className="member-number">{index + 1}</span>
                  <span className="member-name">{member.name}</span>
                  <span>{member.email}</span>
                  <span>{member.plan}</span>
                  <span>{formatCurrency(member.feesPaid)}</span>
                  <span className="member-status">
                    {member.currentlyInside ? "Inside Gym" : member.status}
                  </span>
                  <button
                    className="delete-member-btn"
                    onClick={() => handleDeleteMember(member._id)}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {showAddMember && (
          <div className="add-member-overlay">
            <div className="add-member-modal">
              <h2>Add New Member</h2>
              <p className="add-member-description">
                Create a new gym member account
              </p>

              <form onSubmit={handleAddMember}>
                <div className="add-member-field">
                  <label>Full Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter member name"
                  />
                </div>

                <div className="add-member-field">
                  <label>Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </div>

                <div className="add-member-row">
                  <div className="add-member-field">
                    <label>Phone</label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="add-member-field">
                    <label>Plan</label>
                    <select
                      name="plan"
                      value={formData.plan}
                      onChange={handleChange}
                    >
                      <option>Starter</option>
                      <option>Premium</option>
                      <option>Elite</option>
                    </select>
                  </div>
                </div>

                <div className="add-member-field">
                  <label>Fees Paid</label>
                  <input
                    type="number"
                    name="feesPaid"
                    value={formData.feesPaid}
                    onChange={handleChange}
                  />
                </div>

                <div className="add-member-actions">
                  <button
                    type="button"
                    className="add-member-cancel"
                    onClick={() => setShowAddMember(false)}
                  >
                    Cancel
                  </button>

                  <button type="submit" className="add-member-submit">
                    Create Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCredentials && (
          <div className="add-member-overlay">
            <div className="add-member-modal">
              <h2>Member Created</h2>
              <p className="add-member-description">
                Save these login credentials
              </p>

              <div className="credentials-box">
                <div className="credential-item">
                  <span>Email</span>
                  <strong>{credentials.email}</strong>
                </div>

                <div className="credential-item">
                  <span>Temporary Password</span>
                  <strong>{credentials.password}</strong>
                </div>
              </div>

              <div className="add-member-actions">
                <button
                  className="add-member-submit"
                  onClick={() => setShowCredentials(false)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {showCheckIn && (
          <div
            className="modal-overlay"
            onClick={() => setShowCheckIn(false)}
          >
            <div
              className="checkin-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="checkin-title"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="modal-header">
                <div>
                  <h2 id="checkin-title">Check In / Check Out Member</h2>
                  <p>
                    Select a member to mark them as inside or outside the
                    gym.
                  </p>
                </div>

                <button
                  className="modal-close"
                  type="button"
                  aria-label="Close check-in dialog"
                  onClick={() => setShowCheckIn(false)}
                >
                  ×
                </button>
              </div>

              <div className="checkin-members">
                {members.map((member) => (
                  <button
                    key={member._id}
                    className="checkin-member-card"
                    type="button"
                    disabled={
                      !member.currentlyInside && insideMembers >= capacity
                    }
                    onClick={() => handleCheckInToggle(member)}
                  >
                    <div className="member-avatar">
                      {member.name.charAt(0)}
                    </div>

                    <div className="checkin-info">
                      <strong>{member.name}</strong>
                      <small>
                        {member.currentlyInside
                          ? "Currently inside"
                          : `${member.plan} Plan`}
                      </small>
                    </div>

                    <span className="checkin-btn">
                      {member.currentlyInside ? "Check Out" : "Check In"}
                    </span>
                  </button>
                ))}
              </div>

              <div className="modal-actions">
                <button
                  className="modal-cancel"
                  type="button"
                  onClick={() => setShowCheckIn(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default OwnerDashboard;