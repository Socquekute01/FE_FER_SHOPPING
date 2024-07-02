import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { convertMoney } from "../../helper";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CardHomePage({ data, brands, status, setReload }) {
  const navigate = useNavigate();
  const brandName = brands.find(
    (item) => parseInt(item.id) === parseInt(data.brands)
  )?.name;

  const statusName = status.find(
    (item) => parseInt(item.id) === parseInt(data.status)
  )?.name;

  const handleAddToCart = async () => {
    try {
      const request = await axios.get("/cart");
      if (request.status === 200) {
        const response = request.data || [];
        const findProductInCart = response.find((item) => item.id === data.id);
        if (findProductInCart) {
          const requestUpdateCart = await axios.put(
            `/cart/${findProductInCart.id}`,
            {
              ...findProductInCart,
              quantity: (findProductInCart.quantity += 1),
            }
          );
          if (requestUpdateCart.status === 200) {
            alert("Your product has been added to the cart!");
          }
        } else {
          const requestCreateItem = await axios.post(`/cart`, {
            ...data,
            quantity: 1,
          });
          if (requestCreateItem.status === 201) {
            alert("Your product has been added to the cart!");
          }
        }
        setReload(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Img variant="top" src={data.images[0]} />
      <Card.Body>
        <Card.Title>{data.name}</Card.Title>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>
          Price: {data.price ? convertMoney(data.price) : 0} vnđ
        </ListGroup.Item>
        <ListGroup.Item>Brands: {brandName}</ListGroup.Item>
        <ListGroup.Item>
          Status:{" "}
          <span
            style={data.status === 1 ? { color: "green" } : { color: "red" }}
          >
            {statusName}
          </span>
        </ListGroup.Item>
      </ListGroup>
      <Card.Body>
        <Button
          variant="danger"
          onClick={() => navigate(`/product/${data.id}`)}
        >
          Details
        </Button>
        &ensp;&ensp;
        <Button
          variant="success"
          onClick={() => {
            handleAddToCart();
          }}
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}

export default CardHomePage;
