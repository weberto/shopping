import React, { Component } from "react";
// import logo from "./logo.svg";
import "./App.css";
// import Modal from "react-modal";
import ReactTable from "react-table";
import "react-table/react-table.css";
import checkboxHOC from "react-table/lib/hoc/selectTable";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

const CheckboxTable = checkboxHOC(ReactTable);

/**
const listStyle = {
  listStyleType: "none",
  textAlign: "left",
  borderBottom: "1px solid #dddddd"
};
const ulStyle = {
  maxWidth: "300px",
  margin: "auto"
};
*/
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      groceryItem: "",
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
  newItem(e) {
    // console.log(`item: ${JSON.stringify(target.value, null, 4)}`);
    // console.log(`TARGET, PROPS: ${JSON.stringify(this.props, null, 4)}`);
    var stateCopy = Object.assign({}, this.state);
    stateCopy.groceryItem = e.target.value;
    this.setState(stateCopy);
  }
  addItem() {
    console.log("adding item");
    console.log(`CATEGORY: ${JSON.stringify(this.state, null, 4)}`);

    let new_item = {
      item: this.state.groceryItem,
      category: this.state.selectedOption.value
        ? this.state.selectedOption.value
        : "",
      favorite: false,
      lastDate: ""
    };
    console.log(`NEW ITEM: ${JSON.stringify(new_item, null, 4)}`);
    var stateCopy = Object.assign({}, this.state);
    stateCopy.list = stateCopy.list.concat(new_item);
    console.log(`NEW ITEM2: ${JSON.stringify(stateCopy.list, null, 4)}`);
    stateCopy.groceryItem = "";
    stateCopy.selectedOption = null;
    this.setState(stateCopy);
    console.log(`NEW ITEM: ${JSON.stringify(this.state, null, 4)}`);
    // this.setState(state => ({ list: state.list.concat(new_item) }));

    /**
    this.setState({
      ...this.state,
    })
    */
  }

  handleChange(selectedOption) {
    console.log(`CATEGORY: ${JSON.stringify(selectedOption, null, 4)}`);
    console.log(`CATEGORY: ${JSON.stringify(this.state, null, 4)}`);
    /**
    console.log(`CATEGORY: ${JSON.stringify(selectedOption, null, 4)}`);
    console.log(`CATEGORY: ${JSON.stringify(this.state, null, 4)}`);
    let list = this.state.list;
    this.setState(state => ({ selectedOption, list }));
    */
    var stateCopy = Object.assign({}, this.state);
    stateCopy.selectedOption = selectedOption;
    this.setState(stateCopy);
    // this.setState({ selectedOption });
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
    const { selectedOption } = this.state;
    const value = selectedOption && selectedOption.value;
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
        }}
      >
        <header className="">
          <h1 className="text-center bg-info" style={{ borderRadius: "0" }}>
            Shopper
          </h1>
        </header>
        {/**
        <div>{list}</div>
        */}
        <div className="container" style={{ marginTop: "30px" }}>
          <Form inline>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="exampleEmail" className="mr-sm-2">
                Item
              </Label>
              <Input
                type="text"
                name="item"
                id="item"
                value={this.state.groceryItem}
                onChange={this.newItem.bind(this)}
                placeholder="grocery item"
              />
            </FormGroup>
            <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
              <Label for="examplePassword" className="mr-sm-2">
                Category
              </Label>
              <Select
                name="form-field-name"
                value={value}
                onChange={this.handleChange.bind(this)}
                options={[
                  { value: "dairy", label: "dairy" },
                  { value: "produce", label: "produce" },
                  { value: "frozen", label: "frozen" },
                  { value: "deli", label: "deli" },
                  { value: "paper", label: "paper" },
                  { value: "cleaning", label: "cleaning" },
                  { value: "canned", label: "canned" },
                  { value: "spices", label: "spices" },
                  { value: "boxed", label: "boxed" },
                  { value: "breakfast", label: "breakfast" },
                  { value: "snacks", label: "snacks" },
                  { value: "meat", label: "meat" }
                ]}
              />
            </FormGroup>
            <Button className="btn btn-info" onClick={this.addItem.bind(this)}>
              Add Item to List
            </Button>
          </Form>
        </div>
        <div>
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
      </div>
    );
  }
}

export default App;
