import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Alert, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Verify2FA: React.FC = () => {
	const [code, setCode] = useState<string[]>(Array(6).fill(""));
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const inputsRef = useRef<HTMLInputElement[]>([]);
	const navigate = useNavigate();
	const location = useLocation();

    const cancel2FA = () => {
        sessionStorage.removeItem("pending2FA");
        sessionStorage.removeItem("email2FA");
        navigate((location.state as any)?.from?.pathname);
    };

	//const email = (location.state as any)?.email;

	let email = (location.state as any)?.email;
	if (!email) {
		email = sessionStorage.getItem("email2FA");
	}

	// si no hay email => significa que entró directo sin login
	useEffect(() => {
		if (!email) {
			navigate("/login", { replace: true });
		}
	}, [email, navigate]);

	useEffect(() => {
		inputsRef.current[0]?.focus();
	}, []);

	const setInputRef = (el: HTMLInputElement | null, idx: number) => {
		if (el) inputsRef.current[idx] = el;
	};

	const tryAutoVerify = (arr: string[]) => {
		const full = arr.join("");
		if (arr.every((d) => d !== "") && full.length === 6) {
			handleVerify(full);
		}
	};

	const handleChange = (value: string, index: number) => {
		if (!/^\d?$/.test(value)) return;

		const next = [...code];
		next[index] = value;
		setCode(next);

		if (value && index < 5) {
			inputsRef.current[index + 1]?.focus();
		}

		tryAutoVerify(next);
	};

	// const handleKeyDown = (
	// 	e: React.KeyboardEvent<HTMLInputElement>,
	// 	index: number
	// ) => {
	// 	if (e.key === "Backspace" && !code[index] && index > 0) {
	// 		inputsRef.current[index - 1]?.focus();
	// 	}
	// 	if (e.key === "ArrowLeft" && index > 0) {
	// 		e.preventDefault();
	// 		inputsRef.current[index - 1]?.focus();
	// 	}
	// 	if (e.key === "ArrowRight" && index < 5) {
	// 		e.preventDefault();
	// 		inputsRef.current[index + 1]?.focus();
	// 	}
	// };

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		e.preventDefault();
		const raw = e.clipboardData.getData("Text") || "";
		const onlyDigits = raw.replace(/\D/g, "").slice(0, 6);

		if (onlyDigits.length === 6) {
			const arr = onlyDigits.split("");
			setCode(arr);
			inputsRef.current[5]?.focus();
			tryAutoVerify(arr);
		}
	};

	const handleVerify = async (fullCode: string) => {
		setError("");
		setIsLoading(true);

		try {
			const { data } = await axios.post(
				"https://api.proyectoalpha.net/api/DemoEndpoints/verificarCodigo2FA",
				{
					email,
					codigo2FA: fullCode,
				}
			);

			if (data.success) {
				
                sessionStorage.removeItem("pending2FA");
	            sessionStorage.removeItem("email2FA");
                navigate(data.redirectUrl || "/");

			} else {
				setError(data.message);
				setCode(Array(6).fill(""));
				inputsRef.current[0]?.focus();
			}
		} catch {
			setError("Error en el servidor, por favor intenta de nuevo");
			setCode(Array(6).fill(""));
			inputsRef.current[0]?.focus();
		} finally {
			setIsLoading(false);
		}
	};

	// Función para enmascarar el email
	const maskEmail = (email: string): string => {
		const [localPart, domain] = email.split("@");
		if (!localPart || !domain) return email; // Si no es un correo válido

		const visiblePart = localPart.slice(0, 3); // Primeros 3 caracteres
		const maskedPart = ".".repeat(3); //.repeat(Math.max(localPart.length - 3, 0)); // El resto con asteriscos
		return `${visiblePart}${maskedPart}@${domain}`;
	};

	return (
		<div className="hub-login-container">
			<Container className="mt-0 mb-5">
				<Row className="justify-content-md-center">
					<Col md={6} className="text-center">
						<h3 className="text-white mb-3">Verificación</h3>

						{
							/* Manejar loading */
							isLoading ? (
								<div style={{ height: 68 }}>
									<div
										className="spinner-grow text-dark m-3"
										role="status"
									>
										<span className="visually-hidden">
											Loading...
										</span>
									</div>
									<div
										className="spinner-grow text-light m-3"
										role="status"
									>
										<span className="visually-hidden">
											Loading...
										</span>
									</div>
									<div
										className="spinner-grow text-dark m-3"
										role="status"
									>
										<span className="visually-hidden">
											Loading...
										</span>
									</div>
									<div
										className="spinner-grow text-light m-3"
										role="status"
									>
										<span className="visually-hidden">
											Loading...
										</span>
									</div>
								</div>
							) : (
								<div style={{ height: 68 }}>
									{error && (
										<Alert
											className="px-0 py-3 m-0"
											style={{
												backgroundColor: "transparent",
												color: "#f7b011",
												fontSize: "16px",
												border: "1px solid #21252900",
												borderRadius: "0px",
											}}
										>
											{error}
										</Alert>
									)}
								</div>
							)
						}

						<p className="text-light mb-4">
							Ingresa el código de 6 dígitos enviado a{" "}
							{
                                email ? <b>{maskEmail(email)}</b> : undefined
                            }
						</p>

						<Form className="d-flex justify-content-center gap-2">
							{code.map((digit, index) => (
								<Form.Control
									key={index}
									type="text"
									inputMode="numeric"
									maxLength={1}
									className="text-center fs-4 px-2"
									style={{ width: "50px", height: "50px" }}
									value={digit}
									ref={(el) => setInputRef(el, index)}
									onChange={(e) =>
										handleChange(e.target.value, index)
									}
									// onKeyDown={(e) => handleKeyDown(e, index)}
									onPaste={handlePaste}
									onFocus={(e) => e.currentTarget.select()}
								/>
							))}
						</Form>

                        <Button variant="outline-light" onClick={ () => cancel2FA() } className="mt-3">Cancelar</Button>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Verify2FA;
