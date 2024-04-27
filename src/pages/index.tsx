import { HomeContainer, Product } from "../styles/pages/home";
import Image from "next/image";
import Head from "next/head";
import { useKeenSlider } from "keen-slider/react";
import Link from "next/link";
import "keen-slider/keen-slider.min.css";
import { stripe } from "../lib/stripe";
import camiseta1 from "@/src/assets/camisetas/1.png";
import { GetStaticProps } from "next";
import Stripe from "stripe";
interface HomeProps {
	products: {
		id: string;
		name: string;
		price: number;
	}[];
}
export default function Home({ products }: HomeProps) {
	const [sliderRef] = useKeenSlider({
		slides: {
			perView: 3,
			spacing: 48,
		},
	});

	return (
		<>
			<Head>
				<title>Home | Ignite Shop</title>
			</Head>
			<HomeContainer ref={sliderRef} className="keen-slider">
				{products.map((product) => {
					return (
						<Link
							key={product.id}
							href={`/product/${product.id}`}
							prefetch={false}
						>
							<Product className="keen-slider__slide">
								<Image src={camiseta1} width={520} height={480} alt="" />
								<footer>
									<strong>{product.name}</strong>
									<span>{product.price}</span>
								</footer>
							</Product>
						</Link>
					);
				})}
			</HomeContainer>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const response = await stripe.products.list({
		expand: ["data.default_price"],
	});

	const products = response.data.map((product) => {
		const price = product.default_price as Stripe.Price;

		return {
			id: product.id,
			name: product.name,
			price: new Intl.NumberFormat("pt-BR", {
				style: "currency",
				currency: "BRL",
			}).format(price.unit_amount! / 100),
		};
	});
	return {
		props: {
			products,
		},
		revalidate: 60 * 60 * 2,
	};
};