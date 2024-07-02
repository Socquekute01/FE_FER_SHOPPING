import axios from "axios";
import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Stack } from "react-bootstrap";
import CardHomePage from "../components/ProductCard/CardHomePage";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [status, setStatus] = useState([]);
  const [products, setProducts] = useState([]);
  const [cloneProducts, setCloneProducts] = useState([]);
  const [reload, setReload] = useState(true);
  const [searchValue, setSearchValue] = useState([]);
  const [countItem, setCountItem] = useState(0);

  const [widthScreen, setWidthScreen] = useState(window.innerWidth);

  const handleSearch = (value) => {
    const indexValue = searchValue.indexOf(parseInt(value));
    let result = [...searchValue];
    if (indexValue !== -1) {
      result = result.filter((item) => item !== parseInt(value));
    } else {
      result.push(parseInt(value));
    }
    setSearchValue(result);
  };

  useEffect(() => {
    if (searchValue.length && products.length) {
      const filterData = products.filter((item) => {
        return searchValue.includes(item.brands);
      });
      setCloneProducts(filterData);
    } else {
      if (!searchValue.length) setCloneProducts(products);
    }
  }, [products, searchValue]);

  useEffect(() => {
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
    const handleFetchProductsData = async () => {
      try {
        const request = await axios.get("/products");
        if (request.status === 200) {
          const response = request.data;
          setProducts(response);
        }
      } catch (e) {
        console.log(e);
      }
    };
    const handleFetchCartData = async () => {
      try {
        const request = await axios.get("/cart");
        if (request.status === 200) {
          const response = request.data;
          setCountItem(response.length);
        }
      } catch (e) {
        console.log(e);
      }
    };

    if (reload) {
      handleFetchBrandsData();
      handleFetchStatusData();
      handleFetchProductsData();
      handleFetchCartData();
      setReload(false);
    }
  }, [reload]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidthScreen(window.innerWidth);
    });
    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);
  return (
    <>
      <h2 className="my-2" style={{ textAlign: "center" }}>
        ABC Shop
      </h2>
      <div
        style={{
          display: "flex",
          margin: "0 5%",
          justifyContent: "space-between",
        }}
      >
        {widthScreen >= 576 && (
          <div className="p-2">
            <h4>Filter by Brands:</h4>
            <Container className="px-5">
              {brands.map((item, index) => {
                return (
                  <Form.Check
                    key={index}
                    type="checkbox"
                    id={`checkbox${item.id}`}
                    label={item?.name}
                    value={item.id}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                );
              })}
            </Container>
          </div>
        )}
        <div className="p-2" style={{ minWidth: "1000px", maxWidth: "100%" }}>
          <h5
            style={{ textAlign: "right", cursor: "pointer" }}
            onClick={() => navigate("/cart")}
          >
            Cart[<span style={{ color: "blue" }}>{countItem}</span>]
          </h5>
          <Row>
            {cloneProducts.map((item, index) => {
              return (
                <Col key={index} sm={3}>
                  <CardHomePage
                    data={item}
                    brands={brands}
                    status={status}
                    setReload={setReload}
                  />
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </>
  );
}

export default HomePage;
