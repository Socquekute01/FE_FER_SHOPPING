import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { convertMoney } from "../helper";

function CartPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  const [reload, setReload] = useState(true);

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        const request = await axios.get("/cart");
        if (request.status === 200) {
          const response = request.data;
          setData(response);
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (reload) {
      handleFetchData();
      setReload(false);
    }
  }, [reload]);
  const totalCart = data.reduce((initalValue, nextValue) => {
    return initalValue + nextValue.price;
  }, 0);
  return (
    <>
      <div style={{ margin: "0 5%" }}>
        <h2 className="my-2" style={{ textAlign: "center" }}>
          SHOPPING CART
        </h2>
        <Button
          variant="success"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          Go to Home
        </Button>
        <br />
        <p
          onClick={() => {}}
          style={{
            textAlign: "right",
            textDecoration: "underline",
            color: "blue",
            cursor: "pointer",
          }}
        >
          Clear cart
        </p>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Product Id</th>
              <th>Product Name</th>
              <th>Image</th>
              <th>Price (vnđ)</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    "
                    <img src={item.images[0]} style={{ height: "80px" }} />
                  </td>
                  <td>{item.price ? convertMoney(item.price) : 0}</td>
                  <td>{item.quantity}</td>
                  <td>
                    {item.price * item.quantity
                      ? convertMoney(item.price * item.quantity)
                      : 0}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <div style={{ textAlign: "right" }}>
          <h6>VAT: 8%</h6>
          <h6>TOTAL: {totalCart ? convertMoney(totalCart) : 0} vnđ</h6>
          <h6>
            TOTAL(VAT): {totalCart ? convertMoney((totalCart * 108) / 100) : 0}
            vnđ
          </h6>
        </div>
      </div>
    </>
  );
}

export default CartPage;
