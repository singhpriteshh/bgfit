from sqlmodel import Session, select
from app.database import engine
from app.models import Product


def seed_products():
    products = [
        Product(
            name="Weird Tee",
            price=999,
            category="Men",
            type="Tee",
            is_new_arrival=True,
            color="Brown",
            image_url="/images/Bigfit1.png",
            back_image_url="/images/Bigfit2.png",
        ),
        Product(
            name="Imagination Tee",
            price=999,
            category="Men",
            type="Tee",
            is_new_arrival=True,
            color="White",
            image_url="/images/Bigfit3.png",
            back_image_url="/images/Bigfit4.png",
        ),
        Product(
            name="Dreamer Tee",
            price=999,
            category="Men",
            type="Tee",
            is_new_arrival=False,
            color="Black",
            image_url="/images/Bigfit5.png",
            back_image_url="/images/Bigfit6.png",
        ),
        Product(
            name="Travis Scott Tee",
            price=999,
            category="Men",
            type="Tee",
            is_new_arrival=False,
            color="Red",
            image_url="/images/Bigfit7.png",
            back_image_url="/images/Bigfit8.png",
        ),
        Product(
            name="Poseidon Tee",
            price=999,
            category="Men",
            type="Tee",
            is_new_arrival=True,
            color="White",
            image_url="/images/Bigfit9.png",
            back_image_url="/images/Bigfit10.png",
        ),
        Product(
            name="Dreams and Reality",
            price=999,
            category="Women",
            type="Tee",
            is_new_arrival=False,
            color="Maroon",
            image_url="/images/Bigfit11.jpg",
            back_image_url="/images/Bigfit12.jpg",
        ),
        Product(
            name="Falcon",
            price=999,
            category="Women",
            type="Tee",
            is_new_arrival=True,
            color="White",
            image_url="/images/Bigfit13.jpg",
            back_image_url="/images/Bigfit14.jpg",
        ),
        Product(
            name="Opposites",
            price=999,
            category="Women",
            type="Tee",
            is_new_arrival=False,
            color="Yellow",
            image_url="/images/Bigfit15.jpg",
            back_image_url="/images/Bigfit16.jpg",
        ),
        Product(
            name="JJK",
            price=999,
            category="Women",
            type="Tee",
            is_new_arrival=False,
            color="Grey",
            image_url="/images/Bigfit17.jpg",
            back_image_url="/images/Bigfit18.jpg",
        ),
        Product(
            name="Mahadev",
            price=999,
            category="Women",
            type="Tee",
            is_new_arrival=True,
            color="Blue",
            image_url="/images/Bigfit19.jpg",
            back_image_url="/images/Bigfit20.jpg",
        ),
    ]

    with Session(engine) as session:
        for product in products:
            statement = select(Product).where(Product.name == product.name)
            results = session.exec(statement)
            existing = results.first()

            if existing:
                existing.price = product.price
                existing.category = product.category
                existing.type = product.type
                existing.is_new_arrival = product.is_new_arrival
                existing.color = product.color
                existing.image_url = product.image_url
                existing.back_image_url = product.back_image_url
                session.add(existing)
            else:
                session.add(product)
        session.commit()
        print("Seeding complete.")


if __name__ == "__main__":
    seed_products()
