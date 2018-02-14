import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
// import Modal from "react-modal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
const CheckboxTable = checkboxHOC(ReactTable);

const listStyle = {
  listStyleType: "none",
  textAlign: "left",
  borderBottom: "1px solid #dddddd"
};
const ulStyle = {
  maxWidth: "300px",
  margin: "auto"
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        { item: "milk", category: "dairy", favorite: true, lastDate: "" },
        { item: "eggs", category: "dairy", favorite: true, lastDate: "" },
        {
          item: "peanut butter",
          category: "breakfast",
          favorite: false,
          lastDate: ""
        },
        { item: "bread", category: "bread", favorite: true, lastDate: "" },
        { item: "pasta", category: "pasta", favorite: true, lastDate: "" }
      ],
      selection: [],
      selectAll: false
    };
  }
  addItem() {
    console.log("adding item");
    let new_item = {
      item: "cheese",
      category: "dairy",
      favorite: false,
      lastDate: ""
    };
    this.setState(state => ({ list: state.list.concat(new_item) }));

    /**
    this.setState({
      ...this.state,
    })
    */
  }
  buildList() {
    let list = null;
    if (this.state.list) {
      list = this.state.list.map((i, index) => {
        return (
          <li style={listStyle} key={index}>
            {i.item}
          </li>
        );
      });
    }
    return <ul style={ulStyle}>{list}</ul>;
  }

  toggleSelection = (key, shift, row) => {
    /*
        Implementation of how to manage the selection state is up to the developer.
        This implementation uses an array stored in the component state.
        Other implementations could use object keys, a Javascript Set, or Redux... etc.
      */
    // start off with the existing state
    let selection = [...this.state.selection];
    const keyIndex = selection.indexOf(key);
    // check to see if the key exists
    if (keyIndex >= 0) {
      // it does exist so we will remove it using destructing
      selection = [
        ...selection.slice(0, keyIndex),
        ...selection.slice(keyIndex + 1)
      ];
    } else {
      // it does not exist so add it
      selection.push(key);
    }
    // update the state
    this.setState({ selection });
  };

  toggleAll = () => {
    /*
        'toggleAll' is a tricky concept with any filterable table
        do you just select ALL the records that are in your data?
        OR
        do you only select ALL the records that are in the current filtered data?

        The latter makes more sense because 'selection' is a visual thing for the user.
        This is especially true if you are going to implement a set of external functions
        that act on the selected information (you would not want to DELETE the wrong thing!).

        So, to that end, access to the internals of ReactTable are required to get what is
        currently visible in the table (either on the current page or any other page).

        The HOC provides a method call 'getWrappedInstance' to get a ref to the wrapped
        ReactTable and then get the internal state and the 'sortedData'.
        That can then be iterrated to get all the currently visible records and set
        the selection state.
      */
    const selectAll = this.state.selectAll ? false : true;
    const selection = [];
    if (selectAll) {
      // we need to get at the internals of ReactTable
      const wrappedInstance = this.checkboxTable.getWrappedInstance();
      // the 'sortedData' property contains the currently accessible records based on the filter and sort
      const currentRecords = wrappedInstance.getResolvedState().sortedData;
      // we just push all the IDs onto the selection array
      currentRecords.forEach(item => {
        selection.push(item._original._id);
      });
    }
    this.setState({ selectAll, selection });
  };

  isSelected = key => {
    /*
        Instead of passing our external selection state we provide an 'isSelected'
        callback and detect the selection state ourselves. This allows any implementation
        for selection (either an array, object keys, or even a Javascript Set object).
      */
    return this.state.selection.includes(key);
  };

  logSelection = () => {
    console.log("selection:", this.state.selection);
  };

  render() {
    const checkboxProps = {
      selectAll: this.state.selectAll,
      isSelected: this.isSelected,
      toggleSelection: this.toggleSelection,
      toggleAll: this.toggleAll,
      selectType: "checkbox"
    };
    // let list = this.buildList();
    return (
      <div
        className="App"
        style={{
          maxWidth: "780px",
          display: "block",
          margin: "auto",
          border: "1px solid #dddddd",
          borderRadius: "10px",
          "@media (maxWidth: 780px)": {
            width: "50%"
          }
        }}>
        <header className="">
          <h1 className="text-center bg-info" style={{ borderRadius: "0" }}>
            Shopper
          </h1>
        </header>
        {/**
        <div>{list}</div>
        */}
        <div style={{ marginTop: "30px" }}>
          <button className="btn btn-info" onClick={this.addItem.bind(this)}>
            Add Item to List
          </button>
        </div>
        <CheckboxTable
          columns={[
            {
              Header: "Item",
              accessor: "item"
            },
            {
              Header: "Category",
              accessor: "category"
            },
            {
              Header: "Favorite",
              accessor: "favorite"
            },
            {
              Header: "Last Date Bought",
              accessor: "lastDate"
            }
          ]}
          ref={r => (this.checkboxTable = r)}
          data={this.state.list}
          className="-striped -highlight"
          {...checkboxProps}
        />
      </div>
    );
  }
}

export default App;
