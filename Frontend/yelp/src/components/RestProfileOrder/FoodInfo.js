class FoodInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <tr>
        <td>Paneer</td>
        <td>Indian</td>
        <td>Indian Special</td>
        <td>2.89</td>
        <td>
          <input type="number" />
        </td>
      </tr>
    );
  }
}

export default FoodInfo;
