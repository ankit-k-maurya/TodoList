import React, { useState, useEffect } from "react";
import "./style.css";
import axios from "../axios.jsx";

const Todo = () => {
  const [inputdata, setInputData] = useState("");
  const [inputtime, setInputtime] = useState("");
  const [inputdate, setInputdate] = useState("");
  const [items, setItems] = useState([]);
  const [isEditItem, setIsEditItem] = useState("");
  const [toggleButton, setToggleButton] = useState(false);


  const getData = async () => {
    try {
      const response = await axios.get('/getSchedule');
      // console.log('respon:',response)
      const detail = response.data.result;
      // console.log("response:", detail);
      setItems(await detail);

    } catch (error) {
      console.log(error);
    }
  };

  // add the items fucnction
  const addItem = async (event) => {
    event.preventDefault();
    if (!inputdata) {
      alert("plz fill the data");
    }
    if (inputdata && toggleButton && inputtime && inputdate) {
      await axios.patch('/UpdateScheduleDetail/' + isEditItem, {
        Task: inputdata,
        TaskDate: inputdate,
        TaskTime: inputtime
      });
      // console.log('res additem', res);
      setItems(
        items.map((curElem) => {
          if (curElem.id === isEditItem) {
            console.log('EditeRes:', isEditItem)
            return { ...curElem, Task: inputdata,  TaskDate: inputdate, TaskTime: inputtime };
          }
          // console.log("currentElem",curElem)
          return curElem;
        })
      );

      setInputData(" ");
      setInputtime(" ");
      setInputdate(" ");
      setIsEditItem(null);
      setToggleButton(false);
    }
    else {
      const res = await axios.post('/Createschedule', {
        Task: inputdata,
        TaskDate : inputdate,
        TaskTime: inputtime
      });
      // console.log('res additem', res);
      // .split("-").reverse().join("-") convert the dd-mm-yyyy to yyyy-mm-dd
      if (res.status === 201) {
        const myNewInputData = {
          ScheduleID: res.data.result.ScheduleID,
          Task: inputdata,
          TaskTime: inputtime,
          TaskDate: inputdate
        };

        const sorteddata =[...items, myNewInputData].sort(
          (a, b) => {
            // '2024-02-03T11:22:18.361Z'
            const dateTimeA = new Date(`${a.date}T${a.time}`);
            const dateTimeB = new Date(`${b.date}T${b.time}`);
            return dateTimeA - dateTimeB;
          })
        // console.log("sorteddata",sorteddata)
        setItems(sorteddata);
        setInputData(" ");
        setInputtime(" ");
        setInputdate(" ")
      } else {
        alert("Failed to create task")
      }
    }
  };

  //edit the items
  const editItem = (index) => {
    const item_todo_edited = items.find((curElem) => {
      return curElem.ScheduleID === index;
    });
    // console.log('editItemres',item_todo_edited)
    setInputData(item_todo_edited.Task);
    setInputtime(item_todo_edited.TaskTime);
    setInputdate(item_todo_edited.TaskDate);
    setIsEditItem(index);
    setToggleButton(true);
  };

  // how to delete items section
  const deleteItem = async (index) => {
   
    const res = await axios.delete('/deleteSchedule/' + index);
    if (res.status === 200) {
      const detail = items.filter((curElem) => {
        return curElem.ScheduleID !== index;
      })
      setItems(detail);
    } 
  };

  // remove all the elements
  const removeAll = () => {
    setItems([]);
  };

  useEffect(() => {
   
    getData();
  }, []);

  console.log('rendering', items)

  return (
    <>
      <div className="main-div">
        <div className="child-div">
          <figure>
            <img src="./todo.jpg" alt="todologo" />
            <figcaption>Add Your List Here ✌</figcaption>
          </figure>
          <div className="addItems">
            <input
              type="text"
              placeholder="✍ Add Task"
              className="form-control"
              value={inputdata}
              onChange={(event) => setInputData(event.target.value)}
            />
            <div className="addItems">
              <input
                type="date"
                placeholder="✍ Add Date"
                className="form-control"
                value={inputdate}
                onChange={(event) => setInputdate(event.target.value)}
              />
            </div>
            <div className="addItems">
              <input
                type="time"
                placeholder="✍ Add Time"
                className="form-control"
                value={inputtime}
                onChange={(event) => setInputtime(event.target.value)}
              />
            </div>
            <br />
          </div>
          <div className="addItems">
            {toggleButton ? (
              <i className="far fa-edit add-btn" onClick={addItem}></i>
            ) : (
              <i className="fa fa-plus add-btn" onClick={addItem}></i>
            )}
          </div>

          {/* show our items  */}
          <div className="showItems">
            {items.map((curElem) => {
              // console.log('Item Info:',items)
              return (
                <div className="eachItem" key={curElem.ScheduleID}>
                  <h3>{curElem.Task}</h3>
                  <h3>{curElem.TaskDate}</h3>
                  <h3>{curElem.TaskTime}</h3>
                  <div className="todo-btn">
                    <i
                      className="far fa-edit add-btn"
                      onClick={() => editItem(curElem.ScheduleID)}
                    ></i>
                    <i
                      className="far fa-trash-alt add-btn"
                      onClick={() => deleteItem(curElem.ScheduleID)}
                    ></i>
                  </div>
                </div>
              );
            })}
          </div>

          {/* rmeove all button  */}
          <div className="showItems">
            <button
              className="btn effect04"
              data-sm-link-text="Remove All"
              onClick={removeAll}
            >
              <span> CHECK LIST</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
};

export default Todo;
