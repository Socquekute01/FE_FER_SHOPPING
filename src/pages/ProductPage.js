import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { convertMoney } from "../helper";

function ProductPage() {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [brands, setBrands] = useState([]);
  const [status, setStatus] = useState([]);
  const [imageSrc, setImageSrc] = useState();

  const [reload, setReload] = useState(true);
  const brandName = brands.find(
    (item) => parseInt(item.id) === parseInt(data.brands)
  )?.name;

  const statusName = status.find(
    (item) => parseInt(item.id) === parseInt(data.status)
  )?.name;

  useEffect(() => {
    if (data.images && data.images.length) {
      setImageSrc(data.images[0]);
    }
  }, [data]);

  useEffect(() => {
    const handleFetchData = async () => {
      try {
        const request = await axios.get(`/products/${id}`);
        if (request.status === 200) {
          const response = request.data;
          setData(response);
        }
      } catch (e) {
        console.log(e);
      }
    };
    const handleFetchBrandsData = async () => {
      try {
        const request = await axios.get("/brands");
        if (request.status === 200) {
          const response = request.data;
          setBrands(response);
        }
      } catch (e) {
        console.log(e);
      }
    };
    const handleFetchStatusData = async () => {
      try {
        const request = await axios.get("/status");
        if (request.status === 200) {
          const response = request.data;
          setStatus(response);
        }
      } catch (e) {
        console.log(e);
      }
    };
    if (reload) {
      handleFetchData();
      handleFetchBrandsData();
      handleFetchStatusData();
      setReload(false);
    }
  }, [reload]);
  return (
    <>
      <div style={{ margin: "0 5%" }}>
        <h2 className="my-2" style={{ textAlign: "center" }}>
          PRODUCT DETAILS
        </h2>
        <Button variant="success" onClick={() => navigate("/")} className="mb-4">
          Go to Home
        </Button>
        <h4>{data?.name}</h4>
        <div className="d-flex">
          <div>
            <img
              src={imageSrc}
              style={{
                width: "680px",
                height: "680px",
                marginBottom: "2%",
                border: "2px solid grey",
              }}
            />
            <div
              className="d-flex"
              style={{
                borderTop: "1px solid",
                borderBottom: "1px solid",
                padding: "10px 12px",
                justifyContent: "center",
              }}
            >
              {data?.images?.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  alt="thumbnail"
                  onMouseOver={() => setImageSrc(item)}
                  style={
                    imageSrc === item
                      ? {
                          width: "100px",
                          height: "60px",
                          margin: "0 2%",
                          cursor: "pointer",
                          border: "1px solid green",
                        }
                      : {
                          width: "100px",
                          height: "60px",
                          margin: "0 2%",
                          cursor: "pointer",
                        }
                  }
                />
              ))}
            </div>
          </div>
          <div style={{ width: "3%" }}></div>
          <div>
            <h4>Price: {data.price ? convertMoney(data.price) : 0} vnđ</h4>
            <h6>Brand: {brandName}</h6>
            <h4>
              Status:{" "}
              <span
                style={
                  data.status === 1 ? { color: "green" } : { color: "red" }
                }
              >
                {statusName}
              </span>
            </h4>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
