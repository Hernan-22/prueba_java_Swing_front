import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  nombreUsuario = '';
  contrasena = '';
  errorMessage = '';
  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }


  onSubmit() {
    console.log(this.loginForm.value);
    console.log("login");
    console.log(this.nombreUsuario)
    this.loginForm.value.nombreUsuario = this.nombreUsuario;
    this.loginForm.value.contrasena = this.contrasena;
    //if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.authService.login(credentials).subscribe(
        (response) => {
          console.log('Login exitoso!', response);
          localStorage.setItem('token', response.accessToken);
          this.router.navigate(['/productos']);
        },
        (error) => {
          console.error('Error en el inicio de sesión', error);
          this.errorMessage = 'Usuario o contraseña incorrectos';
        }
      );
    //}
  }


}
